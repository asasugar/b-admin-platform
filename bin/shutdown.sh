#!/bin/bash -e
# root

export PATH=$PATH:/usr/local/nodejs/bin:/usr/sbin

# 加载公共辅助函数库
source "$(dirname "$0")/common.sh"

# 进入shell脚本当前的目录bin
cd `dirname $0`

print_title "B-ADMIN SHUTDOWN TOOL"
print_info "开始关闭服务..."

# 往上一级就是project root
cd ..

PROJECT_ROOT=$(pwd)
PROJECT_NAME="${PROJECT_ROOT##*/}"

print_info "项目: ${PROJECT_NAME}"
print_info "执行停止命令..."

pnpm run stop

print_success "关闭操作完成!"
