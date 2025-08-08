#!/bin/bash -e
# root
# 定义环境变量
env=$1
skip=$2
export PATH=$PATH:/usr/local/nodejs/bin:/usr/sbin

# 加载公共辅助函数库
source "$(dirname "$0")/common.sh"

# 进入shell脚本当前的目录bin
cd `dirname $0`

# 显示标题
print_title

# 输出构建开始信息
print_step "0" "初始化构建环境"
print_info "构建开始..."

# 导航到项目根目录
cd ..

PROJECT_ROOT=$(pwd)
PROJECT_NAME="${PROJECT_ROOT##*/}"
cd ..
NODE_ROOT=$(pwd)
LOG_ROOT=$NODE_ROOT/logs/$PROJECT_NAME
# 如有私有源，可使用verdaccio的私有仓库，否则使用npm的公共仓库
REGISTRY="https://registry.npmjs.org"
# 兼容性处理：将 APP_NAME 转换为小写
# APP=${APP_NAME,,}
APP="demo" # 调试的时候写死

# 显示环境信息
print_env_info "$env" "$PROJECT_NAME" "$PROJECT_ROOT" "$NODE_ROOT" "$LOG_ROOT" "$APP"

# 检查环境变量
if [ -z "$env" ];
  then
    print_error "构建脚本需要环境参数"
    echo -e "${YELLOW}💡 提示:${NC} 环境参数必须是以下之一: ${BOLD}local / test / test2 / test3 / test4 / pre / prod${NC}"
    exit 1
fi

# 日志文件
PNPMLOGFILE="${PROJECT_NAME}.pnpm.log"
BUILDLOGFILE="${PROJECT_NAME}.pnpm.build.log"

# 清除旧的日志文件
print_info "清理旧的日志文件..."
rm -f "${PNPMLOGFILE}" "${BUILDLOGFILE}"

# 设置环境变量
print_step "1" "设置环境变量"
print_info "设置 NODE_SYSTEM_ENV=${env}, KOA_SERVER_ENV=${env}, APP=${APP}"
if [ "$skip" = "skip" ]; then
    print_warning "跳过依赖安装模式"
fi
export NODE_SYSTEM_ENV=${env} KOA_SERVER_ENV=${env} APP=${APP}

cd $PROJECT_ROOT

# 依赖安装步骤
if [ "$skip" != "skip" ];
  then
    print_step "2" "安装项目依赖"
    print_info "开始安装依赖包..."
    print_info "Registry: ${REGISTRY}"
    print_info "日志文件: ${PNPMLOGFILE}"

    print_progress 1 3 "正在安装依赖..."
    pnpm install --registry=${REGISTRY} >& ${PNPMLOGFILE} || true

    # 检查错误
    NPMERRCOUNT=`grep -ci 'ERROR' ${PNPMLOGFILE} 2>/dev/null || echo "0"`

    if [ "$NPMERRCOUNT" -gt 0 ];
      then
        print_error "PNPM 安装失败"
        echo -e "\n${BOLD}${RED}📋 错误日志:${NC}"
        echo -e "${RED}$(cat ${PNPMLOGFILE})${NC}"

        # 首次安装失败，强制清理缓存
        print_warning "首次安装失败，正在清理存储..."
        print_progress 2 3 "清理PNPM存储..."

        # 安全地获取存储路径
        STORE_PATH=$(pnpm store path 2>/dev/null)
        if [ -n "$STORE_PATH" ] && [ -d "$STORE_PATH" ]; then
            print_info "存储路径: $STORE_PATH"
            rm -rf "$STORE_PATH" || {
                print_error "PNPM 存储清理失败!!"
                exit 1
            }
            print_success "存储清理完成"
        else
            print_warning "无法获取存储路径，使用替代方法..."
            pnpm store prune || {
                print_error "PNPM 存储修剪失败!!"
                exit 1
            }
        fi

        # 再次尝试安装依赖
        print_info "重试安装依赖..."
        print_progress 3 3 "正在重试安装..."
        pnpm install --registry="$REGISTRY" >& "${PNPMLOGFILE}" || true
        NPMERRCOUNT=`grep -ci 'ERROR' ${PNPMLOGFILE} 2>/dev/null || echo "0"`

        # 再次检查错误
        if [ "$NPMERRCOUNT" -gt 0 ];
          then
            print_error "重试安装依然失败"
            echo -e "\n${BOLD}${RED}📋 最终错误日志:${NC}"
            echo -e "${RED}$(cat "${PNPMLOGFILE}")${NC}"
            rm -f "${PNPMLOGFILE}"
            exit 1
        fi
    fi

    print_success "依赖安装完成"
    # 显示完整安装日志
    print_log "安装日志" "$PNPMLOGFILE"
else
    print_warning "跳过依赖安装步骤"
fi

# 设置 NODE_ENV 为 production
export NODE_ENV="production"

print_step "3" "项目构建"
echo -e "\n${BOLD}${WHITE}🔧 构建配置:${NC}"
echo -e "${CYAN}  NODE_ENV:${NC} ${NODE_ENV}"
echo -e "${CYAN}  NODE_SYSTEM_ENV:${NC} ${NODE_SYSTEM_ENV}"
echo -e "${CYAN}  KOA_SERVER_ENV:${NC} ${KOA_SERVER_ENV}"
echo -e "${CYAN}  APP:${NC} ${APP}"

# 构建项目
print_info "开始项目构建..."


# 根据 APP 环境变量决定构建方式
if [ -n "$APP" ]; then
    print_info "检测到子节点服务节点: ${APP}"
    print_info "执行增量构建模式..."
    print_progress 1 1 "正在构建指定应用..."

    BUILD_CMD="pnpm run build:app"
    print_info "构建命令: ${BUILD_CMD}"

    NODE_OPTIONS=--max-old-space-size=10240 eval "$BUILD_CMD" >& ${BUILDLOGFILE}
else
    print_info "未检测到子服务节点，执行完整构建..."
    print_progress 1 1 "正在构建所有项目..."

    NODE_OPTIONS=--max-old-space-size=10240 pnpm run build >& ${BUILDLOGFILE} || true
fi

# 检查构建错误
BUILDERRCOUNT=`grep -ci 'ERROR' ${BUILDLOGFILE} 2>/dev/null || echo "0"`
if [ "$BUILDERRCOUNT" -gt 0 ];
  then
    print_error "项目构建失败"
    echo -e "\n${BOLD}${RED}📋 构建错误日志:${NC}"
    echo -e "${RED}$(cat ${BUILDLOGFILE})${NC}"
    rm -f "${BUILDLOGFILE}"
    exit 1
fi

# 输出构建成功信息
print_success "项目构建完成"

# 显示完整构建日志
print_log "构建日志" "$BUILDLOGFILE"

# 最终成功信息
if [ -n "$APP" ]; then
    print_success_box "构建成功完成!" "${env}" "@${PROJECT_NAME}/frontend/${APP}"
else
    print_success_box "构建成功完成!" "${env}" "${PROJECT_NAME}"
fi
