#!/bin/bash -e
# 用于 CI 镜像优化：保留 Backend 依赖，删除其他依赖

# 加载公共辅助函数库
source "$(dirname "$0")/common.sh"

# 进入项目根目录
cd "$(dirname "$0")"
cd ..

export PATH=$PATH:/usr/local/nodejs/bin:/usr/sbin
PROJECT_ROOT=$(pwd)
PROJECT_NAME="${PROJECT_ROOT##*/}"

print_title "BACKEND DEPENDENCY PRUNING TOOL"
print_info "开始精准优化依赖包（保留 Backend Only）..."

print_step "1" "检查依赖目录"
print_info "检查 node_modules 目录状态..."

if [ -d "node_modules" ]; then
    NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1 || echo "未知")
    print_info "📦 检测到 node_modules 目录，大小: ${NODE_MODULES_SIZE}"
else
    print_info "📭 node_modules 目录不存在"
fi

print_step "2" "分析保留依赖"
print_info "分析需要保留的 Backend 依赖..."

# 分析需要保留的依赖
print_progress 1 3 "正在分析依赖..."

KEEP_PACKAGES=$(node --input-type=commonjs -e "
const fs = require('fs');

// 读取 backend 的 package.json
const backendPkg = JSON.parse(fs.readFileSync('packages/backend/package.json', 'utf8'));
const backendDeps = Object.keys(backendPkg.dependencies || {});

// 添加必需的运行时包
const essentialPackages = ['turbo', 'tsx', 'typescript', 'dotenv', 'dotenv-cli', 'cross-env', 'deepmerge'];

// 合并所有需要保留的依赖
const allDeps = new Set([...backendDeps, ...essentialPackages]);

// 如果有 backend/node_modules，分析其中的符号链接
const backendNodeModules = 'packages/backend/node_modules';
if (fs.existsSync(backendNodeModules)) {
  try {
    const items = fs.readdirSync(backendNodeModules);
    items.forEach(item => {
      if (item !== '.bin' && !item.startsWith('.')) {
        // 处理 @scope 包
        if (item.startsWith('@')) {
          const scopePath = backendNodeModules + '/' + item;
          if (fs.existsSync(scopePath)) {
            const scopeItems = fs.readdirSync(scopePath);
            scopeItems.forEach(scopeItem => {
              allDeps.add(item + '/' + scopeItem);
            });
          }
        } else {
          allDeps.add(item);
        }
      }
    });
  } catch (e) {
    // 忽略错误
  }
}

console.log(Array.from(allDeps).join('\n'));
" 2>/dev/null)

if [ -z "$KEEP_PACKAGES" ]; then
    print_error "无法获取依赖信息"
    print_error "请确保 packages/backend/package.json 文件存在且格式正确"
    exit 1
fi

print_info "📦 保留依赖数量: $(echo "$KEEP_PACKAGES" | wc -l | tr -d ' ') 个"

print_step "3" "清理多余依赖"
print_info "保留 Backend 依赖，清理其他包..."

# 清理不需要的包
print_progress 2 3 "正在清理多余包..."
REMOVED_COUNT=0
KEPT_COUNT=0

if [ -d "node_modules" ]; then
    for package_dir in node_modules/*; do
        if [ -d "$package_dir" ]; then
            package_name=$(basename "$package_dir")

            # 跳过 .bin 目录和以 . 开头的目录
            if [[ "$package_name" == ".bin" ]] || [[ "$package_name" == .* ]]; then
                continue
            fi

            # 处理 @scope 包
            if [[ "$package_name" == @* ]]; then
                for scoped_package in "$package_dir"/*; do
                    if [ -d "$scoped_package" ]; then
                        scoped_name="${package_name}/$(basename "$scoped_package")"
                        if echo "$KEEP_PACKAGES" | grep -q "^${scoped_name}$"; then
                            KEPT_COUNT=$((KEPT_COUNT + 1))
                        else
                            rm -rf "$scoped_package"
                            REMOVED_COUNT=$((REMOVED_COUNT + 1))
                        fi
                    fi
                done
                # 如果 scope 目录为空，删除它
                if [ -z "$(ls -A "$package_dir" 2>/dev/null)" ]; then
                    rm -rf "$package_dir"
                fi
            else
                # 普通包
                if echo "$KEEP_PACKAGES" | grep -q "^${package_name}$"; then
                    KEPT_COUNT=$((KEPT_COUNT + 1))
                else
                    rm -rf "$package_dir"
                    REMOVED_COUNT=$((REMOVED_COUNT + 1))
                fi
            fi
        fi
    done

    print_success "清理完成：保留 ${KEPT_COUNT} 个包，移除 ${REMOVED_COUNT} 个包"
else
    print_info "node_modules 目录不存在"
    KEPT_COUNT=0
    REMOVED_COUNT=0
fi

print_step "4" "验证保留依赖"
print_info "验证 Backend 启动所需依赖..."

# 验证关键依赖是否保留
print_progress 3 3 "正在验证依赖完整性..."

MISSING_DEPS=""
for dep in "turbo" "koa" "tsx" "typescript" "cross-env" "dotenv" "dotenv-cli" "deepmerge"; do
    if [ ! -d "node_modules/$dep" ] && [ ! -d "node_modules/.pnpm" ]; then
        MISSING_DEPS="$MISSING_DEPS $dep"
    fi
done

if [ -n "$MISSING_DEPS" ]; then
    print_warning "部分关键依赖可能缺失: $MISSING_DEPS"
else
    print_success "关键依赖验证通过"
fi

print_step "5" "优化结果统计"
OPTIMIZED_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1 || echo "0B")

echo -e "\n${BOLD}${WHITE}📊 依赖优化统计:${NC}"
echo -e "${CYAN}  优化后大小:${NC} ${OPTIMIZED_SIZE}"
echo -e "${CYAN}  保留包数:${NC} ${KEPT_COUNT}"
echo -e "${CYAN}  移除包数:${NC} ${REMOVED_COUNT}"
echo -e "${CYAN}  优化模式:${NC} ${BOLD}${GREEN}精准保留模式${NC}"
echo -e "${CYAN}  依赖状态:${NC} ${BOLD}${GREEN}Backend 依赖${NC}"

print_success_box "依赖优化完成!" "生产环境" "Backend Only"

print_info "💡 提示："
print_info "  - 🎯 保留了 Backend 运行时依赖"
print_info "  - 🗑️ 删除了前端应用和构建工具依赖"
print_info "  - 📦 适用于 CI 镜像体积最小化"
print_info "  - ✅ Backend 可通过 pnpm run start:prod 启动"

echo -e "\n${GREEN}✅ 依赖优化完成！${NC}"
