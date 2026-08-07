#!/bin/bash
# Hub 页面部署脚本
# 提交源码 -> 构建 -> 推送 gh-pages 分支（GitHub Pages 读取的是构建产物）
#
# 用法: bash scripts/deploy.sh "commit message"

set -euo pipefail

REPO_DIR="/Users/mr.mu/MU Mei/MU CatDesk/mu-skill-hub"
MSG="${1:-chore: update skill cards}"

cd "$REPO_DIR"

# 1. 提交并推送源码
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "$MSG"
  git push origin main
  echo "[1/3] 源码已推送到 main"
else
  echo "[1/3] 无源码变更，跳过提交"
fi

# 2. 加载 nvm 并构建（npm 不在默认 PATH 中）
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: 未找到 npm，请检查 nvm 安装" >&2
  exit 1
fi

npm install --silent
npm run build
echo "[2/3] 构建完成"

# 3. 部署构建产物到 gh-pages
npx --yes gh-pages -d dist
echo "[3/3] 已部署到 gh-pages 分支"
echo
echo "页面地址: https://muippt.github.io/mu-skill-hub/"
echo "提示: GitHub Pages CDN 通常需要 20-60 秒刷新"
