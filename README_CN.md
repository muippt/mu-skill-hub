<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/default-banner.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/default-banner.png">
    <img alt="mu-skill-hub" src="assets/default-banner.png" width="100%">
  </picture>
</p>

# 🦞 mu-skill-hub

> 精选 AI Skill 集合——覆盖办公通用、专业细分、装机必备三大类别，一键浏览、预览、安装。

[English](README.md) | **中文** | [🌐 在线主页](https://muippt.github.io/mu-skill-hub/)

[![微信公众号](https://img.shields.io/badge/muippt-07C160?logo=wechat&logoColor=white)](https://mp.weixin.qq.com/s/v1JSZvlN5fvbOOHvkvXEtA)
[![小红书](https://img.shields.io/badge/muippt-FF2442?logo=xiaohongshu&logoColor=white)](https://xhslink.com/m/ESxtgUNMdl)
[![书籍](https://img.shields.io/badge/书籍-图解团队管理-BBDDE5?logo=bookstack&logoColor=white)](https://item.m.jd.com/product/14547345.html)

[![License](https://img.shields.io/github/license/muippt/mu-skill-hub)](LICENSE)
[![Stars](https://img.shields.io/github/stars/muippt/mu-skill-hub)](https://github.com/muippt/mu-skill-hub/stargazers)

## 💡 使用场景示例

- 🎨 **PPT 设计**：「把这周周报做成 10 页 PPT，用 Fathom 数据叙事风格」——由 [mu-ippt](https://muippt.github.io/mu-ippt/) 驱动
- 📊 **Excel 自动化**：「合并这 5 张表，加透视表，生成图表」——由 [mu-excel-toolbox](https://github.com/muippt/mu-excel-toolbox) 驱动
- 🔄 **PDF 转换**：「把这个 PDF 高保真转成可编辑的 PPT」——由 [mu-pdf-converter](https://muippt.github.io/mu-pdf-converter/) 驱动
- 🔧 **Skill 创作**：「帮我从零创建一个 AI Skill，带质量门控」——由 [mu-skill-creator](https://muippt.github.io/mu-skill-creator/) 驱动
- 🌐 **浏览全部 Skill**：「给我看所有可用的 Skill，带预览和安装链接」——访问[在线主页](https://muippt.github.io/mu-skill-hub/)
- 📱 **社交内容**：「为我的开源 Skill 生成一套小红书封面图文」——由 mu-redskill-intro 驱动

## ✨ 核心亮点

#### 🗂️ 三大 Skill 分类

所有 Skill 按三大类别清晰组织，快速找到你需要的：

| 类别 | 说明 | 典型 Skill |
|------|------|-----------|
| 💼 **办公通用** | 不分岗位、不分专业，打工人都需要 | PPT 设计、Excel 分析、写作润色、会议管理 |
| 🎯 **专业细分** | 按岗位/专业深度定制 | 团队管理、HR 技能、设计工具、微信文章、小红书图文 |
| 🔧 **装机必备** | AI 工作流的基础能力包 | 自我进化、Token 管理、Skill 创建、安全防护 |

#### ⚡ FAST 判断原则

内置「什么工作可以 Skill 化」的决策框架：

- **F**ixed（可固定）——规则能否明确定义？
- **A**utomatable（可自动化）——流程能否脱离人工判断运行？
- **S**tandardized（可标准化）——任务能否规模化复制？
- **T**estable（可验收）——交付物能否客观验证？

四项全过的事，就是最适合做成 AI Skill 的候选。

#### 🚀 一键直达

每张 Skill 卡片直接链接到对应的 GitHub 主页或 Landing Page——点击即可预览文档、了解详情、一键安装。不用搜索，不用猜。

## 📌 与同类工具对比

| 维度 | mu-skill-hub | 传统 Skill 清单 | 手动搜索 |
|------|-------------|----------------|---------|
| 可视化预览 | ✅ 交互式 Landing Page，带动画 | ❌ 纯文本列表 | ❌ 逐个搜索 |
| 分类体系 | ✅ 三大类别 + Tab 切换 | 部分 | ❌ |
| Skill 化框架 | ✅ 内置 FAST 原则 | ❌ | ❌ |
| 一键安装 | ✅ 直达 GitHub/Page 链接 | 部分 | ❌ 手动查找 |
| 移动端适配 | ✅ 响应式设计 | 不一定 | 不适用 |
| 开源 | ✅ MIT | 不一定 | 不适用 |

## 🚀 工作流

| 工作流 | 场景 | 如何开始 |
|--------|------|---------|
| **浏览** | 通过分类标签可视化探索全部 Skill | 访问[在线主页](https://muippt.github.io/mu-skill-hub/) |
| **评估** | 判断你的工作能否 Skill 化 | 在页面上应用 FAST 原则 |
| **安装** | 把 Skill 装进你的 AI Agent | 点击 Skill 卡片 → 进入 GitHub → 按 Quick Start 操作 |
| **贡献** | 把你的 Skill 加入宝库 | Fork → 添加 Skill 数据 → 提交 PR |

## ⚙️ 技术规格

| 项目 | 说明 |
|------|------|
| 框架 | React 18 + Vite |
| UI | Tailwind CSS + Radix UI + Framer Motion |
| 部署 | GitHub Pages（静态构建） |
| 构建 | `npm run build` → `dist/` |
| 动画 | 滚动进入、3D 卡片悬浮、粒子效果、打字机文字 |
| 响应式 | 移动优先，适配所有屏幕尺寸 |
| 构建产物 | ~214KB |

## 🛠️ 快速开始

**第一步：安装依赖**

```bash
npm install
```

**第二步：启动开发服务器**

```bash
npm run dev
```

**第三步：构建生产版本**

```bash
npm run build
```

> 💡 或者直接访问[在线主页](https://muippt.github.io/mu-skill-hub/)——无需安装即可浏览全部 Skill。

## 🔒 安全与隐私

- 纯静态站点——无后端、无数据库、无服务端处理
- 无遥测、无数据分析、无 Cookie、无追踪
- 所有 Skill 链接指向公开的 GitHub 仓库
- MIT 许可证，可自由 fork、修改、再分发

## ⭐ Star 趋势

如果这个项目帮你发现了好用的 AI Skill，请给一个 ⭐！

<a href="https://star-history.com/#muippt/mu-skill-hub&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=muippt/mu-skill-hub&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=muippt/mu-skill-hub&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=muippt/mu-skill-hub&type=Date" />
  </picture>
</a>

> 一句话总结：精心策展的 AI Skill 宝库——在一个地方浏览、评估、安装所有 Skill。

## 👤 作者简介

🎓 清华大学出版社签约作家 / 2026当当影响力作家 / 某互联网大厂 AI 大模型业务 HR 砖家 / 一级人力资源管理师 / 二级心理咨询师 / 野生设计师

📚 著有[《图解团队管理》](https://item.m.jd.com/product/14547345.html)，服务客户有字节跳动、腾讯、百度、中国移动、SMG、BOE…

💡 [微信公众号](https://mp.weixin.qq.com/s/v1JSZvlN5fvbOOHvkvXEtA) / [小红书](https://xhslink.com/m/ESxtgUNMdl)：muippt

## 📄 许可证与致谢

[MIT](LICENSE) © 2026 木先生iPPT

基于 React、Vite、Tailwind CSS、Radix UI、Framer Motion、Recharts 和 Lucide Icons 构建。

> 声明：本项目大部分内容由 AI 辅助完成。如您认为您的作品被使用但未获得适当署名，请提交 issue。
