#!/bin/bash

# =============================================================================
# B-Admin Platform 公共辅助函数库
# =============================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# =============================================================================
# 进度条函数
# =============================================================================
print_progress() {
    local step=$1
    local total=$2
    local message=$3
    local percent=$((step * 100 / total))

    # 简单的进度显示
    printf "${BLUE}[%s/%s]${NC} ${BOLD}%s${NC} (%d%%)\n" "$step" "$total" "$message" "$percent"
}

# =============================================================================
# 标题和步骤显示函数
# =============================================================================

# 打印主标题
print_title() {
    local title=${1:-"LUCKYSALSEFE BUILD TOOL"}
    echo -e "\n${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║${NC}${BOLD}${WHITE}                       ${title}                ${NC}${BOLD}${BLUE}║${NC}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}\n"
}

# 打印步骤标题
print_step() {
    local step=$1
    local title=$2
    echo -e "\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${WHITE}  STEP $step: $title${NC}"
    echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}


# =============================================================================
# 消息输出函数
# =============================================================================

# 打印信息
print_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

# 打印成功
print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

# 打印警告
print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

# 打印错误
print_error() {
    echo -e "${RED}❌${NC} $1"
}

# 打印调试信息（仅在调试模式下显示）
print_debug() {
    if [[ "${DEBUG:-}" == "true" ]]; then
        echo -e "${PURPLE}🐛${NC} [DEBUG] $1"
    fi
}

# =============================================================================
# 结果展示函数
# =============================================================================

# 打印成功结果框
print_success_box() {
    local title=${1:-"操作成功完成!"}
    local env=$2
    local project_name=$3

    echo -e "\n${BOLD}${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${GREEN}                   🎉 ${title} 🎉                      ${NC}"

    if [[ -n "$env" ]]; then
        echo -e "${BOLD}${GREEN}                        环境: ${env}                          ${NC}"
    fi

    if [[ -n "$project_name" ]]; then
        echo -e "${BOLD}${GREEN}               项目: ${project_name}         ${NC}"
    fi

    echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}\n"
}

# =============================================================================
# 环境信息显示函数
# =============================================================================

# 显示环境信息
print_env_info() {
    local env=$1
    local project_name=$2
    local project_root=$3
    local node_root=$4
    local log_root=$5
    local app_name=$6

    echo -e "\n${BOLD}${WHITE}📋 环境信息:${NC}"
    # 根据 app_name 是否存在来显示项目名称
    if [ -n "$app_name" ]; then
        echo -e "${CYAN}  项目名称:${NC} ${BOLD}${project_name}/${app_name}${NC}"
    else
        echo -e "${CYAN}  项目名称:${NC} ${BOLD}${project_name}${NC}"
    fi
    echo -e "${CYAN}  项目根目录:${NC} ${project_root}"
    echo -e "${CYAN}  Node根目录:${NC} ${node_root}"
    echo -e "${CYAN}  日志目录:${NC} ${log_root}"
    echo -e "${CYAN}  服务节点:${NC} ${BOLD}${app_name}"
    echo -e "${CYAN}  构建环境:${NC} ${BOLD}${YELLOW}${env}${NC}"
    echo -e "${CYAN}  用户:${NC} $(whoami)"
    echo -e "${CYAN}  PNPM版本:${NC} $(pnpm -v 2>/dev/null || echo '未安装')"
    echo -e "${CYAN}  Node版本:${NC} $(node -v 2>/dev/null || echo '未安装')"
}

# =============================================================================
# 日志显示函数
# =============================================================================

# 显示日志内容
print_log() {
    local title=$1
    local log_file=$2
    local color=${3:-$BLUE}

    if [[ -f "$log_file" ]]; then
        echo -e "\n${BOLD}${color}📋 ${title}:${NC}"
        echo -e "${color}$(cat "$log_file")${NC}"
    else
        print_warning "日志文件不存在: $log_file"
    fi
}

# =============================================================================
# 工具函数
# =============================================================================

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 获取脚本所在目录
get_script_dir() {
    echo "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
}

# 获取项目根目录
get_project_root() {
    echo "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
}

# 安全地获取 pnpm 存储路径
get_pnpm_store_path() {
    pnpm store path 2>/dev/null
}

# =============================================================================
# 脚本信息
# =============================================================================
print_debug "公共辅助函数库已加载"