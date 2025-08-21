#!/bin/bash -e
# root
env=$1
export PATH=$PATH:/usr/local/nodejs/bin:/usr/sbin

# 加载公共辅助函数库
source "$(dirname "$0")/common.sh"

print_title "B-ADMIN STARTUP TOOL"
print_info "启动开始..."

# 进入shell脚本当前的目录bin
cd `dirname $0`
# 往上一级就是project root
cd ..

PROJECT_ROOT=$(pwd)
PROJECT_NAME="${PROJECT_ROOT##*/}"
cd ..
NODE_ROOT=$(pwd)
LOG_ROOT=$NODE_ROOT/logs/$PROJECT_NAME

# 显示环境信息
print_env_info "$env" "$PROJECT_NAME" "$PROJECT_ROOT" "$NODE_ROOT" "$LOG_ROOT"

if [ "$env" = "" ];
  then
    print_error "启动脚本需要环境参数"
    echo -e "${YELLOW}💡 提示:${NC} 环境参数必须是以下之一: ${BOLD}local / test / test2 / test3 / pre / prod${NC}"
    exit 1
fi

print_info "设置环境变量: NODE_SYSTEM_ENV=${env} KOA_SERVER_ENV=${env}"
export NODE_SYSTEM_ENV=${env} KOA_SERVER_ENV=${env}

cd $PROJECT_ROOT

print_info "创建日志目录: ${LOG_ROOT}"
mkdir -p $LOG_ROOT

print_info "停止现有服务..."
pnpm run stop

print_info "启动服务..."
pnpm run start:prod -- --stdout="$LOG_ROOT/master-stdout.log" --stderr="$LOG_ROOT/master-stderr.log"

print_success "服务启动完成"
