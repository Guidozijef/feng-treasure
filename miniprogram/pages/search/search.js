const { showToast } = require('../../utils/util.js');

// 全站 18 款精选极客数字资源库（完整覆盖原型图 6 款核心及扩展资源）
const ALL_RESOURCES = [
  {
    id: 'cursor-ai',
    title: 'Cursor AI 高级代码开发辅助神器',
    shortTitle: 'Cursor AI 高级代码开...',
    icon: '/images/res_cursor_ai.svg',
    iconBg: '#eef6ff',
    version: 'v0.42',
    versionClass: 'ver-blue',
    tags: [
      { text: 'AI编程', type: 'tag-blue' },
      { text: '免配置', type: 'tag-green' }
    ],
    rating: '4.9',
    size: '128MB',
    channels: '夸克 / 百度网盘',
    btnText: '获取',
    btnType: 'solid',
    downloads: 48200,
    publishDate: '2025-05-18'
  },
  {
    id: 'cursor-prompts',
    title: 'Cursor 核心 System Prompts 调优秘籍',
    shortTitle: 'Cursor 核心 System Prom...',
    icon: '/images/res_prompt_box.svg',
    iconBg: '#f5f3ff',
    version: '',
    versionClass: '',
    tags: [
      { text: '效率配置', type: 'tag-blue' },
      { text: '精选合辑', type: 'tag-yellow' }
    ],
    rating: '5.0',
    size: '1.4MB',
    channels: '直链即下',
    btnText: '查看',
    btnType: 'outline',
    downloads: 19600,
    publishDate: '2025-05-16'
  },
  {
    id: 'notion-patch',
    title: 'Notion 中文增强汉化补丁包稳定版',
    shortTitle: 'Notion 中文增强汉化补丁包...',
    icon: '/images/res_notion_patch.svg',
    iconBg: '#ecfdf5',
    version: '',
    versionClass: '',
    tags: [
      { text: '桌面端全支持', type: 'tag-green' },
      { text: '双端通用', type: 'tag-slate' }
    ],
    rating: '4.8',
    size: '24.8MB',
    channels: '阿里云盘 / 夸克',
    btnText: '获取',
    btnType: 'solid',
    downloads: 38900,
    publishDate: '2025-05-15'
  },
  {
    id: 'picgo',
    title: 'PicGo 图床高效管理神器稳定版',
    shortTitle: 'PicGo 图床高效管理...',
    icon: '/images/res_picgo.svg',
    iconBg: '#fff7ed',
    version: 'v2.3.1',
    versionClass: 'ver-green',
    tags: [
      { text: 'Markdown利器', type: 'tag-blue' },
      { text: '开源免费', type: 'tag-green' }
    ],
    rating: '4.9',
    size: '67.2MB',
    channels: 'GitHub / 蓝奏云',
    btnText: '获取',
    btnType: 'solid',
    downloads: 52100,
    publishDate: '2025-05-14'
  },
  {
    id: 'vscode',
    title: 'VS Code 代码增强离线离线插件合辑',
    shortTitle: 'VS Code 代码增强离线离线...',
    icon: '/images/res_vscode_ext.svg',
    iconBg: '#ecfeff',
    version: '',
    versionClass: '',
    tags: [
      { text: 'VSIX离线包', type: 'tag-blue' },
      { text: '热门', type: 'tag-yellow' }
    ],
    rating: '4.7',
    size: '82MB',
    channels: '百度 / 夸克',
    btnText: '查看',
    btnType: 'outline',
    downloads: 41200,
    publishDate: '2025-05-10'
  },
  {
    id: 'gitkraken',
    title: 'GitKraken 可视化版本树控制套件',
    shortTitle: 'GitKraken 可视化版本树控...',
    icon: '/images/res_gitkraken.svg',
    iconBg: '#eef2ff',
    version: '',
    versionClass: '',
    tags: [
      { text: 'Git工具', type: 'tag-blue' },
      { text: '完整文档', type: 'tag-green' }
    ],
    rating: '4.8',
    size: '194MB',
    channels: '夸克直链',
    btnText: '获取',
    btnType: 'solid',
    downloads: 29800,
    publishDate: '2025-05-08'
  },
  {
    id: 'typora',
    title: 'Typora 写作神器 Markdown 编辑器',
    shortTitle: 'Typora 极简写作利器...',
    icon: '/images/hot_typora.svg',
    iconBg: '#fef2f2',
    version: 'v1.8.10',
    versionClass: 'ver-blue',
    tags: [
      { text: '写作利器', type: 'tag-blue' },
      { text: '数学公式', type: 'tag-green' }
    ],
    rating: '4.9',
    size: '72.4MB',
    channels: '夸克 / 百度网盘',
    btnText: '获取',
    btnType: 'solid',
    downloads: 62800,
    publishDate: '2025-05-05'
  },
  {
    id: 'docker',
    title: 'Docker Desktop 本地轻量化容器引擎',
    shortTitle: 'Docker Desktop 容器引擎...',
    icon: '/images/hot_docker.svg',
    iconBg: '#e0f2fe',
    version: 'v4.28',
    versionClass: 'ver-blue',
    tags: [
      { text: '开发者利器', type: 'tag-blue' },
      { text: '国内镜像加速', type: 'tag-green' }
    ],
    rating: '4.8',
    size: '512MB',
    channels: '阿里云盘 / 百度',
    btnText: '获取',
    btnType: 'solid',
    downloads: 34500,
    publishDate: '2025-05-04'
  },
  {
    id: 'windterm',
    title: 'WindTerm 极客高颜值终端客户端',
    shortTitle: 'WindTerm 极客终端...',
    icon: '/images/hot_windterm.svg',
    iconBg: '#f0fdf4',
    version: 'v2.6.1',
    versionClass: 'ver-green',
    tags: [
      { text: 'SSH神器', type: 'tag-green' },
      { text: 'C语言编写', type: 'tag-blue' }
    ],
    rating: '4.8',
    size: '34.8MB',
    channels: '直链即下',
    btnText: '获取',
    btnType: 'solid',
    downloads: 27900,
    publishDate: '2025-05-03'
  },
  {
    id: 'pixpin',
    title: 'PixPin 离线长截图与智能贴图工具',
    shortTitle: 'PixPin 截图贴图神器...',
    icon: '/images/hot_pixpin.svg',
    iconBg: '#fffbeb',
    version: 'v1.8.8',
    versionClass: 'ver-yellow',
    tags: [
      { text: '无广告', type: 'tag-green' },
      { text: '离线OCR', type: 'tag-blue' }
    ],
    rating: '4.9',
    size: '26.4MB',
    channels: '蓝奏云 / 夸克',
    btnText: '获取',
    btnType: 'solid',
    downloads: 31200,
    publishDate: '2025-05-01'
  },
  {
    id: 'bandizip',
    title: 'Bandizip 纯净免广告解压神器',
    shortTitle: 'Bandizip 纯净解压缩...',
    icon: '/images/hot_bandizip.svg',
    iconBg: '#eef2ff',
    version: 'v6.29',
    versionClass: 'ver-blue',
    tags: [
      { text: '多核极速', type: 'tag-blue' },
      { text: '永久无广告', type: 'tag-green' }
    ],
    rating: '4.8',
    size: '8.2MB',
    channels: '直链即下',
    btnText: '获取',
    btnType: 'solid',
    downloads: 55400,
    publishDate: '2025-04-28'
  },
  {
    id: 'deepseek-kit',
    title: 'DeepSeek 开发者私有化本地知识库套件',
    shortTitle: 'DeepSeek 私有知识库...',
    icon: '/images/res_cursor_ai.svg',
    iconBg: '#eef6ff',
    version: '2025版',
    versionClass: 'ver-blue',
    tags: [
      { text: 'Ollama整合', type: 'tag-blue' },
      { text: '一键运行', type: 'tag-green' }
    ],
    rating: '5.0',
    size: '1.8GB',
    channels: '夸克 / 百度网盘',
    btnText: '查看',
    btnType: 'outline',
    downloads: 47200,
    publishDate: '2025-04-25'
  },
  {
    id: 'navicat',
    title: 'Navicat Premium 16 数据库综合管理套件',
    shortTitle: 'Navicat 16 数据库利器...',
    icon: '/images/res_prompt_box.svg',
    iconBg: '#f5f3ff',
    version: 'v16.3',
    versionClass: 'ver-blue',
    tags: [
      { text: 'SQL智能优化', type: 'tag-blue' },
      { text: '多数据库联动', type: 'tag-green' }
    ],
    rating: '4.9',
    size: '86MB',
    channels: '夸克 / 百度网盘',
    btnText: '获取',
    btnType: 'solid',
    downloads: 38800,
    publishDate: '2025-04-20'
  },
  {
    id: 'postman',
    title: 'Postman 离线本地纯净版免登录客户端',
    shortTitle: 'Postman 离线接口调试...',
    icon: '/images/res_vscode_ext.svg',
    iconBg: '#fff7ed',
    version: '',
    versionClass: '',
    tags: [
      { text: '免登录离线', type: 'tag-green' },
      { text: 'API接口调试', type: 'tag-blue' }
    ],
    rating: '4.7',
    size: '142MB',
    channels: '夸克 / 蓝奏云',
    btnText: '获取',
    btnType: 'solid',
    downloads: 24300,
    publishDate: '2025-04-18'
  },
  {
    id: 'fcp-lut',
    title: 'Final Cut Pro 电影级调色预设包 2025',
    shortTitle: 'FCPX 电影级调色预设...',
    icon: '/images/res_picgo.svg',
    iconBg: '#fdf2f8',
    version: '2025版',
    versionClass: 'ver-yellow',
    tags: [
      { text: '电影质感', type: 'tag-yellow' },
      { text: '一键套用', type: 'tag-green' }
    ],
    rating: '4.9',
    size: '320MB',
    channels: '夸克网盘',
    btnText: '查看',
    btnType: 'outline',
    downloads: 18900,
    publishDate: '2025-04-15'
  },
  {
    id: 'idea-plugins',
    title: 'IntelliJ IDEA 开发者高频提效扩展全家桶',
    shortTitle: 'IDEA 提效扩展插件包...',
    icon: '/images/res_vscode_ext.svg',
    iconBg: '#f0fdf4',
    version: '',
    versionClass: '',
    tags: [
      { text: '代码补全', type: 'tag-blue' },
      { text: '高频装机推荐', type: 'tag-yellow' }
    ],
    rating: '4.8',
    size: '45MB',
    channels: '直链即下',
    btnText: '获取',
    btnType: 'solid',
    downloads: 26500,
    publishDate: '2025-04-12'
  },
  {
    id: 'cs408',
    title: '计算机 408 考研考点知识脉络全集精校版',
    shortTitle: '计算机 408 核心考点...',
    icon: '/images/res_notion_patch.svg',
    iconBg: '#ecfdf5',
    version: '2025版',
    versionClass: 'ver-green',
    tags: [
      { text: '考研资料', type: 'tag-green' },
      { text: '思维导图精校', type: 'tag-slate' }
    ],
    rating: '4.9',
    size: '128MB',
    channels: '阿里云盘 / 夸克',
    btnText: '获取',
    btnType: 'solid',
    downloads: 36700,
    publishDate: '2025-04-10'
  },
  {
    id: 'termius',
    title: 'Termius 全平台终端管理器与跨端同步配置',
    shortTitle: 'Termius 全平台终端...',
    icon: '/images/res_gitkraken.svg',
    iconBg: '#eef2ff',
    version: '',
    versionClass: '',
    tags: [
      { text: 'SSH多端同步', type: 'tag-blue' },
      { text: 'SFTP支持', type: 'tag-green' }
    ],
    rating: '4.8',
    size: '58MB',
    channels: '夸克网盘',
    btnText: '获取',
    btnType: 'solid',
    downloads: 21900,
    publishDate: '2025-04-05'
  }
];

Page({
  data: {
    // 搜索输入内容
    searchKeyword: 'Cursor',

    // 排序类型: 'composite' (综合) | 'latest' (最新发布) | 'download' (下载最多)
    sortType: 'composite',

    // 筛选出的资源列表
    filteredList: [],

    // 匹配的资源数量
    totalCount: 18
  },

  onLoad(options) {
    let kw = 'Cursor';
    if (options && options.keyword !== undefined) {
      kw = decodeURIComponent(options.keyword);
    }
    this.setData({ searchKeyword: kw }, () => {
      this.executeFilter();
    });
  },

  // 监听输入
  onSearchInput(e) {
    const kw = e.detail.value;
    this.setData({ searchKeyword: kw }, () => {
      this.executeFilter();
    });
  },

  // 清除输入
  onClearInput() {
    this.setData({ searchKeyword: '' }, () => {
      this.executeFilter();
    });
  },

  // 点击键盘搜索或搜索按钮
  onSearchConfirm() {
    this.executeFilter();
  },

  // 切换排序方式
  onSwitchSort(e) {
    const type = e.currentTarget.dataset.sort;
    if (this.data.sortType === type) return;
    this.setData({ sortType: type }, () => {
      this.executeFilter();
    });
  },

  // 核心检索与排序计算
  executeFilter() {
    const { searchKeyword, sortType } = this.data;
    const kw = searchKeyword.trim().toLowerCase();

    let list = [...ALL_RESOURCES];

    // 关键词过滤
    if (kw) {
      list = list.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(kw);
        const shortMatch = item.shortTitle.toLowerCase().includes(kw);
        const tagsMatch = item.tags.some(t => t.text.toLowerCase().includes(kw));
        const channelMatch = item.channels.toLowerCase().includes(kw);
        return titleMatch || shortMatch || tagsMatch || channelMatch;
      });
    }

    // 排序逻辑
    if (sortType === 'latest') {
      list.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    } else if (sortType === 'download') {
      list.sort((a, b) => b.downloads - a.downloads);
    } else {
      // 综合排序：先看关键词权重与评分
      list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    this.setData({
      filteredList: list,
      totalCount: list.length
    });
  },

  // 点击资源卡片或右侧获取/查看按钮
  onResourceTap(e) {
    const id = e.currentTarget.dataset.id;
    // 映射到已有的详情数据或统一传参
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  },

  // 底部虚线卡片：跳转求资源工单页面
  onWishBannerTap() {
    wx.navigateTo({
      url: '/pages/request/request'
    });
  }
});
