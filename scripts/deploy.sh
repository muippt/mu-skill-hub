#!/bin/bash
# Hub 页面部署脚本
# 提交源码 -> 推送 main 分支 -> GitHub Actions 自动构建并部署到 GitHub Pages
# 注意: 实际部署由 .github/workflows/deploy.yml 完成，本脚本只需提交源码即可
#
# 用法: bash scripts/deploy.sh "commit message"
# 环境变量: GITHUB_TOKEN - GitHub PAT，用于查询 Actions 状态（可选）

set -euo pipefail

REPO_DIR="/Users/mr.mu/MU Mei/MU CatDesk/mu-skill-hub"
MSG="${1:-chore: update skill cards}"

cd "$REPO_DIR"

# 1. 提交并推送源码到 main 分支
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "$MSG"
  git push origin main
  echo "[1/2] 源码已推送到 main，GitHub Actions 将自动触发构建和部署"
else
  echo "[1/2] 无源码变更，跳过提交"
fi

# 2. 检查 GitHub Actions 部署状态（如有 GITHUB_TOKEN）
if [ -n "${GITHUB_TOKEN:-}" ]; then
  RUN_ID=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/muippt/mu-skill-hub/actions/runs?per_page=1" \
    | python3 -c "import json,sys; print(json.load(sys.stdin)['workflow_runs'][0]['id'])" 2>/dev/null || echo "")
  if [ -n "$RUN_ID" ]; then
    echo "[2/2] Actions Run #$RUN_ID 已触发，请前往查看状态:"
    echo "  https://github.com/muippt/mu-skill-hub/actions/runs/$RUN_ID"
  else
    echo "[2/2] 无法获取 Actions Run ID"
  fi
else
  echo "[2/2] 未设置 GITHUB_TOKEN，请手动检查 Actions 状态:"
  echo "  https://github.com/muippt/mu-skill-hub/actions"
fi
echo
echo "页面地址: https://muippt.github.io/mu-skill-hub/"
