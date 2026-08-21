#!/bin/bash
# Hub 页面部署脚本
# 提交源码 -> 推送 main 分支 -> GitHub Actions 自动构建并部署到 GitHub Pages
# 注意: 实际部署由 .github/workflows/deploy.yml 完成，本脚本只需提交源码即可
#
# 用法: bash scripts/deploy.sh "commit message"
# 环境变量: GITHUB_TOKEN - GitHub PAT，用于 git push 认证和查询 Actions 状态（必须）

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MSG="${1:-chore: update skill cards}"
REPO_URL="https://github.com/muippt/mu-skill-hub.git"

cd "$REPO_DIR"

# 认证检查
if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: 未设置 GITHUB_TOKEN 环境变量" >&2
  exit 1
fi

AUTH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/muippt/mu-skill-hub.git"

# 1. 提交并推送源码到 main 分支
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "$MSG"
  git push "$AUTH_URL" main
  echo "[1/2] 源码已推送到 main，GitHub Actions 将自动触发构建和部署"
else
  echo "[1/2] 无源码变更，跳过提交"
fi

# 2. 检查 GitHub Actions 部署状态
sleep 5
RUN_ID=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/muippt/mu-skill-hub/actions/runs?per_page=1" \
  | python3 -c "import json,sys; runs=json.load(sys.stdin).get('workflow_runs',[]); print(runs[0]['id'] if runs else '')" 2>/dev/null || echo "")

if [ -n "$RUN_ID" ]; then
  echo "[2/2] Actions Run #$RUN_ID 已触发，请前往查看状态:"
  echo "  https://github.com/muippt/mu-skill-hub/actions/runs/$RUN_ID"
else
  echo "[2/2] 无法获取 Actions Run ID，请手动检查:"
  echo "  https://github.com/muippt/mu-skill-hub/actions"
fi
echo
echo "页面地址: https://muippt.github.io/mu-skill-hub/"
