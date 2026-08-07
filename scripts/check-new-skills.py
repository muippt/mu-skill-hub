#!/usr/bin/env python3
"""Hub 页面新 Skill 巡检

对比 GitHub 用户 muippt 的 public 仓库与 src/pages/Index.jsx 中已收录的 skill，
输出尚未收录的仓库清单（含描述与 Landing Page 可用性）。

用法: python3 scripts/check-new-skills.py
"""

import json
import os
import re
import subprocess
import sys
import urllib.request

GITHUB_USER = "muippt"
EXCLUDE_REPOS = {"mu-skill-hub"}  # Hub 页面本身不收录

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_FILE = os.path.join(REPO_DIR, "src", "pages", "Index.jsx")


def get_token():
    """从 git credential store 提取 GitHub token。"""
    path = os.path.expanduser("~/.git-credentials")
    try:
        with open(path) as f:
            for line in f:
                m = re.search(r"(ghp_[A-Za-z0-9]+)@github\.com", line)
                if m:
                    return m.group(1)
    except OSError:
        pass
    return None


def fetch_repos(token):
    url = f"https://api.github.com/users/{GITHUB_USER}/repos?type=public&per_page=100"
    req = urllib.request.Request(url)
    if token:
        req.add_header("Authorization", f"token {token}")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def landing_page_ok(repo):
    """检查 GitHub Pages Landing Page 是否返回 200。"""
    url = f"https://{GITHUB_USER}.github.io/{repo}/"
    try:
        out = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", url],
            capture_output=True, text=True, timeout=20,
        )
        return out.stdout.strip() == "200"
    except Exception:
        return False


def main():
    token = get_token()
    if not token:
        print("WARN: 未找到 GitHub token，改用未认证请求（可能触发限流）", file=sys.stderr)

    try:
        repos = fetch_repos(token)
    except Exception as e:
        print(f"ERROR: 获取仓库列表失败: {e}")
        return 1

    if not isinstance(repos, list):
        print(f"ERROR: GitHub API 返回异常: {json.dumps(repos)[:200]}")
        return 1

    with open(INDEX_FILE, encoding="utf-8") as f:
        index_content = f.read()

    new_repos = []
    for r in repos:
        name = r["name"]
        if name in EXCLUDE_REPOS:
            continue
        # 仓库名出现在 link 字段中即视为已收录
        if re.search(re.escape(name) + r'[/"]', index_content):
            continue
        new_repos.append((name, r.get("description") or ""))

    print(f"GitHub 仓库总数: {len(repos)}（排除 {len(EXCLUDE_REPOS)} 个非 skill 仓库）")

    if not new_repos:
        print("RESULT: NO_NEW_SKILLS — 无新增，Hub 页面已是最新")
        return 0

    print(f"RESULT: FOUND {len(new_repos)} 个新 Skill 未收录\n")
    for name, desc in new_repos:
        ok = landing_page_ok(name)
        link = (f"https://{GITHUB_USER}.github.io/{name}/" if ok
                else f"https://github.com/{GITHUB_USER}/{name}")
        print(f"- 仓库名: {name}")
        print(f"  描述: {desc}")
        print(f"  推荐链接: {link}" + ("" if ok else "  (Landing Page 不可用，降级用仓库地址)"))
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
