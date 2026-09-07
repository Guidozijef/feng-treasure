# 枫的藏宝阁 · 原生微信小程序工程 (WeChat Mini Program)

本目录为遵循微信官方标准架构规范开发的**原生微信小程序完整工程**。

## 目录结构说明

```text
├── project.config.json           # 微信开发者工具项目配置（指定 miniprogramRoot: "miniprogram/"）
└── miniprogram/
    ├── app.json                  # 全局配置、路由列表、TabBar与全局窗口样式
    ├── app.js                    # 小程序生命周期与全局数据管理
    ├── app.wxss                  # 小程序全局样式与主题变量
    ├── sitemap.json              # 微信索引检索规则
    ├── utils/
    │   └── util.js               # 原生微信剪贴板、Toast与通用工具函数
    └── pages/
        ├── home/                 # 首页（大搜索框、Banner推荐、分类金刚区、热门飙升榜、综合推荐）
        │   ├── home.json
        │   ├── home.wxml
        │   ├── home.wxss
        │   └── home.js
        ├── hot/                  # 热门风云榜（总榜飙升/本周/今日/评分、三甲领跑榜、4-8上升榜单、收藏）
        │   ├── hot.json
        │   ├── hot.wxml
        │   ├── hot.wxss
        │   └── hot.js
        ├── category/             # 资源分类库（左侧垂直导航、右侧细分场景标签、多维高级筛选抽屉）
        │   ├── category.json
        │   ├── category.wxml
        │   ├── category.wxss
        │   └── category.js
        ├── detail/               # 资源详情页（四维参数、直链通道、更新日志、半屏下载提取与复制）
        │   ├── detail.json
        │   ├── detail.wxml
        │   ├── detail.wxss
        │   └── detail.js
        └── profile/              # 个人中心（用户UID卡片、统计指标、权益通知、历史与缓存清理）
            ├── profile.json
            ├── profile.wxml
            ├── profile.wxss
            └── profile.js
```

## 如何在「微信开发者工具」中导入与运行？

1. 下载并安装官方最新版 **[微信开发者工具 (Stable)](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)**。
2. 打开微信开发者工具，点击 **「导入」**（或「+」新建项目）。
3. 选择项目根目录（含有 `project.config.json` 的目录）。
4. **AppID**：可填写您注册的小程序 AppID，也可以直接选择 **「测试号」** 体验免登录运行。
5. **后端服务**：选择「不使用云服务」。
6. 点击确定即可立即在模拟器中实时预览、真机扫码调试和上传发布！
