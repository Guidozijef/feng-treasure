const { showToast } = require('../../utils/util.js');

// 8 大分类对应的专属场景标签配置
const CATEGORY_SCENES_MAP = {
  pc: [
    { id: 'mac', name: 'Mac 专区', active: true },
    { id: 'win', name: 'Windows常用', active: false },
    { id: 'essential', name: '装机必备', active: false },
    { id: 'opensource', name: '开源神器', active: false },
    { id: 'plugin', name: '浏览器插件', active: false },
    { id: 'portable_tag', name: '便携绿色', active: false }
  ],
  study: [
    { id: 'cs', name: '计算机408', active: true },
    { id: 'algo', name: '算法题库', active: false },
    { id: 'math', name: '考研数学', active: false },
    { id: 'english', name: '四六级核心', active: false },
    { id: 'pdf', name: '高清PDF彩印', active: false },
    { id: 'notes', name: '学霸手写笔记', active: false }
  ],
  tools: [
    { id: 'devops', name: '运维部署', active: true },
    { id: 'ocr', name: 'OCR识别', active: false },
    { id: 'screen', name: '截图贴图', active: false },
    { id: 'terminal', name: '终端SSH', active: false },
    { id: 'zip', name: '压缩解压', active: false },
    { id: 'sync', name: '多端同步', active: false }
  ],
  design: [
    { id: 'ps', name: 'PS/PR插件', active: true },
    { id: 'lut', name: '电影LUT调色', active: false },
    { id: 'font', name: '商用免费字库', active: false },
    { id: 'c4d', name: '3D/C4D工程', active: false },
    { id: 'ui', name: 'Figma组件', active: false },
    { id: 'sketch', name: '矢量图标库', active: false }
  ],
  dev: [
    { id: 'frontend', name: 'Vue/React源码', active: true },
    { id: 'backend', name: 'Spring Boot脚手架', active: false },
    { id: 'ai', name: '大模型Agent', active: false },
    { id: 'docker_tpl', name: 'Compose编排', active: false },
    { id: 'python', name: '爬虫与自动化', active: false },
    { id: 'electron', name: '桌面客户端', active: false }
  ],
  media: [
    { id: 'player', name: '高帧播放器', active: true },
    { id: 'encode', name: '无损压制工具', active: false },
    { id: 'music', name: '无损音质解码', active: false },
    { id: 'cut', name: '剪辑特效包', active: false },
    { id: 'sub', name: '字幕自动提取', active: false },
    { id: 'stream', name: '直播推流推介', active: false }
  ],
  game: [
    { id: 'steam', name: 'Steam汉化补丁', active: true },
    { id: 'mod', name: '精选MOD整合', active: false },
    { id: 'emu', name: '街机复古模拟器', active: false },
    { id: 'speed', name: '加速辅助脚本', active: false },
    { id: 'tool', name: '手柄映射工具', active: false },
    { id: 'save', name: '完美通关存档', active: false }
  ],
  office: [
    { id: 'ppt', name: '商务精美PPT', active: true },
    { id: 'excel', name: '财务自动函数表', active: false },
    { id: 'word', name: '毕业论文排版', active: false },
    { id: 'resume', name: '高通过率简历', active: false },
    { id: 'notion', name: 'Notion知识库', active: false },
    { id: 'mind', name: '思维导图模板', active: false }
  ]
};

// 8 大分类对应的资源数据库（电脑应用包含原型图中 5 大高颜值卡片）
const CATEGORY_ITEMS_MAP = {
  pc: [
    {
      id: 'picgo',
      title: 'PicGo 图床利器',
      badge: 'v2.4',
      badgeClass: 'badge-blue',
      desc: '好用的云存储图床管理工具，支...',
      fullDesc: '好用的云存储图床管理工具，支持一键上传与剪贴板自动格式转换。',
      platform: '免安装',
      size: '48 MB',
      rating: '4.9',
      icon: '/images/res_picgo.svg',
      iconBg: '#e0eaff',
      downloads: 52100
    },
    {
      id: 'docker',
      title: 'Docker Desktop 优化版',
      badge: '推荐',
      badgeClass: 'badge-green',
      desc: '开发必备容器虚拟化环境，适配...',
      fullDesc: '开发必备容器虚拟化环境，适配 M1/M2/M3 及 Win11 WSL2 镜像调优。',
      platform: 'Mac / Win',
      size: '520 MB',
      rating: '4.8',
      icon: '/images/hot_docker.svg',
      iconBg: '#e0eaff',
      downloads: 34500
    },
    {
      id: 'potplayer',
      title: 'PotPlayer 纯净免...',
      fullTitle: 'PotPlayer 纯净免安装版',
      badge: '60帧整合',
      badgeClass: 'badge-orange',
      desc: '内置 MadVR、LAV 解码滤镜与无...',
      fullDesc: '内置 MadVR、LAV 解码滤镜与无黑边硬件加速，画质极致通透。',
      platform: '全能播放器',
      size: '35 MB',
      rating: '4.9',
      icon: '/images/res_potplayer.svg',
      iconBg: '#fef3c7',
      downloads: 41800
    },
    {
      id: 'typora',
      title: 'Typora 历史经典版',
      badge: '最后免授权',
      badgeClass: 'badge-slate',
      desc: '所见即所得 Markdown 文本编辑...',
      fullDesc: '所见即所得 Markdown 文本编辑器，极简免干扰无多余授权校验。',
      platform: '写作神器',
      size: '78 MB',
      rating: '4.9',
      icon: '/images/hot_typora.svg',
      iconBg: '#e0e7ff',
      downloads: 62800
    },
    {
      id: 'utools',
      title: 'uTools 极客生产力箱',
      badge: '插件化',
      badgeClass: 'badge-green',
      desc: '快捷呼出搜索框，自由装配...',
      fullDesc: '快捷呼出搜索框，自由装配多款实用效率插件与剪切板增强。',
      platform: '跨平台',
      size: '85 MB',
      rating: '4.8',
      icon: '/images/res_utools.svg',
      iconBg: '#4ade80',
      downloads: 39600
    }
  ],
  study: [
    {
      id: 'cs408',
      title: '计算机 408 考研脉络全集',
      badge: '2025版',
      badgeClass: 'badge-blue',
      desc: '数据结构、操作系统、组原与网络...',
      fullDesc: '精校高清彩印 PDF 与知识图谱梳理。',
      platform: '电子书/笔记',
      size: '128 MB',
      rating: '4.9',
      icon: '/images/res_notion_patch.svg',
      iconBg: '#ecfdf5',
      downloads: 36700
    }
  ],
  tools: [
    {
      id: 'windterm',
      title: 'WindTerm 极客高颜值终端',
      badge: 'v2.6.1',
      badgeClass: 'badge-green',
      desc: '纯 C 编写极速终端，内存极低...',
      fullDesc: '极速终端与 SSH 客户端，内存占用极低。',
      platform: 'Windows / Mac',
      size: '34.8 MB',
      rating: '4.8',
      icon: '/images/hot_windterm.svg',
      iconBg: '#f0fdf4',
      downloads: 27900
    }
  ],
  design: [
    {
      id: 'fcp-lut',
      title: '电影级 3D LUT 调色预设',
      badge: '2025精选',
      badgeClass: 'badge-orange',
      desc: '专业电影色调一键套用，适配各大剪辑...',
      fullDesc: '专业电影色调一键套用，适配 FCPX/PR/剪映。',
      platform: '调色预设',
      size: '320 MB',
      rating: '4.9',
      icon: '/images/res_picgo.svg',
      iconBg: '#fdf2f8',
      downloads: 18900
    }
  ],
  dev: [
    {
      id: 'cursor-ai',
      title: 'Cursor AI 代码辅助套件',
      badge: 'v0.42',
      badgeClass: 'badge-blue',
      desc: 'AI 驱动编程神装，开箱免配置...',
      fullDesc: 'AI 驱动编程神装，开箱免配置即刻写代码。',
      platform: 'Mac / Win',
      size: '128 MB',
      rating: '4.9',
      icon: '/images/res_cursor_ai.svg',
      iconBg: '#eef6ff',
      downloads: 48200
    }
  ],
  media: [
    {
      id: 'potplayer',
      title: 'PotPlayer 纯净免安装版',
      badge: '60帧整合',
      badgeClass: 'badge-orange',
      desc: '内置 MadVR、LAV 解码滤镜与无...',
      fullDesc: '内置 MadVR、LAV 解码滤镜与无黑边硬件加速，画质极致通透。',
      platform: '全能播放器',
      size: '35 MB',
      rating: '4.9',
      icon: '/images/res_potplayer.svg',
      iconBg: '#fef3c7',
      downloads: 41800
    }
  ],
  game: [
    {
      id: 'game-emu',
      title: 'RetroArch 怀旧模拟器全集',
      badge: '全核心',
      badgeClass: 'badge-blue',
      desc: '覆盖 FC、GBA、街机等多平台游戏...',
      fullDesc: '覆盖 FC、GBA、街机等多平台游戏，完美兼容手柄。',
      platform: '全平台',
      size: '420 MB',
      rating: '4.8',
      icon: '/images/cat_game.svg',
      iconBg: '#eff6ff',
      downloads: 25600
    }
  ],
  office: [
    {
      id: 'notion-patch',
      title: 'Notion 中文增强汉化补丁包',
      badge: '全端支持',
      badgeClass: 'badge-green',
      desc: '桌面端全汉化，快捷键与界面完全本地化...',
      fullDesc: '桌面端全汉化，快捷键与界面完全本地化。',
      platform: 'Mac / Win',
      size: '24.8 MB',
      rating: '4.8',
      icon: '/images/res_notion_patch.svg',
      iconBg: '#ecfdf5',
      downloads: 38900
    }
  ]
};

Page({
  data: {
    // 导航栏自适应布局参数
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 左侧选中的导航分类 key
    activeNav: 'pc',

    // 左侧 8 大分类列表 (带 HOT 徽章)
    categories: [
      { id: 'pc', name: '电脑应用', icon: '/images/cat_pc.svg', hasHot: false },
      { id: 'study', name: '学习资料', icon: '/images/cat_study.svg', hasHot: true },
      { id: 'tools', name: '效率利器', icon: '/images/cat_tools.svg', hasHot: false },
      { id: 'design', name: '设计素材', icon: '/images/cat_design.svg', hasHot: false },
      { id: 'dev', name: '源码开发', icon: '/images/cat_dev.svg', hasHot: false },
      { id: 'media', name: '影音多媒体', icon: '/images/cat_media.svg', hasHot: false },
      { id: 'game', name: '游戏娱乐', icon: '/images/cat_game.svg', hasHot: false },
      { id: 'office', name: '办公模版', icon: '/images/cat_office.svg', hasHot: false }
    ],

    // 顶部横向快速标签滚动栏
    quickTags: [
      { id: 'direct', name: '全部直链', hasArrow: true, active: true },
      { id: 'portable', name: '免解压绿色版', hasArrow: false, active: false },
      { id: 'today', name: '今日最新', hasDot: true, hasArrow: false, active: false },
      { id: 'highScore', name: '高分必收', hasArrow: false, active: false },
      { id: 'openSource', name: '开源神器', hasArrow: false, active: false },
      { id: 'appleM', name: 'M芯片适配', hasArrow: false, active: false }
    ],

    // 右侧细分场景标签列表
    subScenes: CATEGORY_SCENES_MAP.pc,

    // 当前选中的场景标签 id
    activeSceneId: 'mac',

    // 排序方式: 'comprehensive' (综合排序) | 'downloads' (下载最多) | 'rating' (按评分)
    activeSort: 'comprehensive',

    // 当前分类下的资源总数
    totalCount: 428,

    // 当前渲染的资源列表
    items: CATEGORY_ITEMS_MAP.pc,

    // 高级筛选抽屉显示状态
    showDrawer: false,

    // 抽屉筛选条件
    drawerFilter: {
      systems: ['win', 'mac'],
      size: 'all',
      license: 'all'
    },
    drawerResultCount: 168
  },

  onLoad() {
    this.initNavBarLayout();
    this.refreshContentData();
  },

  // 计算自定义导航栏尺寸与胶囊对齐
  initNavBarLayout() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      let navBarHeight = 44;
      let menuButtonRight = 12;

      if (wx.getMenuButtonBoundingClientRect) {
        const menuRect = wx.getMenuButtonBoundingClientRect();
        if (menuRect && menuRect.top) {
          navBarHeight = (menuRect.top - statusBarHeight) * 2 + menuRect.height;
          menuButtonRight = systemInfo.windowWidth - menuRect.left + 10;
        }
      }

      this.setData({
        statusBarHeight,
        navBarHeight,
        menuButtonRight
      });
    } catch (e) {
      console.error('初始化分类页导航栏尺寸异常', e);
    }
  },

  // 顶部返回箭头点击 (由于分类是 TabBar 页，返回切回首页 Tab)
  onBackTap() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 顶部搜索框点击直达统一搜索中心页面
  onGoToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  // 切换左侧大分类
  switchNav(e) {
    const nav = e.currentTarget.dataset.nav;
    if (this.data.activeNav === nav) return;

    this.setData({
      activeNav: nav,
      subScenes: CATEGORY_SCENES_MAP[nav] || [],
      activeSceneId: (CATEGORY_SCENES_MAP[nav] && CATEGORY_SCENES_MAP[nav][0]) ? CATEGORY_SCENES_MAP[nav][0].id : ''
    }, () => {
      this.refreshContentData();
    });
  },

  // 切换横向快速标签
  onToggleQuickTag(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.quickTags.map(tag => {
      if (tag.id === id) {
        return { ...tag, active: !tag.active };
      }
      return tag;
    });
    this.setData({ quickTags: list });
    showToast('已更新标签筛选条件');
  },

  // 切换细分场景标签
  onSwitchScene(e) {
    const id = e.currentTarget.dataset.id;
    const subScenes = this.data.subScenes.map(s => ({
      ...s,
      active: s.id === id
    }));
    this.setData({
      activeSceneId: id,
      subScenes
    });
  },

  // 点击「全部标签 >」
  onAllTagsTap() {
    this.toggleDrawer();
  },

  // 切换排序方式
  setSort(e) {
    const sort = e.currentTarget.dataset.sort;
    if (this.data.activeSort === sort) return;

    this.setData({ activeSort: sort }, () => {
      let items = [...this.data.items];
      if (sort === 'downloads') {
        items.sort((a, b) => b.downloads - a.downloads);
      } else if (sort === 'rating') {
        items.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      } else {
        // 恢复默认
        items = CATEGORY_ITEMS_MAP[this.data.activeNav] || [];
      }
      this.setData({ items });
    });
  },

  // 根据当前 activeNav 刷新资源列表
  refreshContentData() {
    const nav = this.data.activeNav;
    const items = CATEGORY_ITEMS_MAP[nav] || CATEGORY_ITEMS_MAP.pc;
    const count = nav === 'pc' ? 428 : (items.length * 48 + 12);

    this.setData({
      items,
      totalCount: count
    });
  },

  // 打开/关闭高级筛选抽屉
  toggleDrawer() {
    this.setData({ showDrawer: !this.data.showDrawer });
  },

  closeDrawer() {
    this.setData({ showDrawer: false });
  },

  // 切换抽屉系统多选
  onToggleDrawerSystem(e) {
    const val = e.currentTarget.dataset.val;
    let systems = [...this.data.drawerFilter.systems];
    const index = systems.indexOf(val);
    if (index > -1) {
      systems.splice(index, 1);
    } else {
      systems.push(val);
    }
    this.setData({
      'drawerFilter.systems': systems,
      drawerResultCount: Math.max(12, 168 - (3 - systems.length) * 36)
    });
  },

  // 切换抽屉体积单选
  onSelectDrawerSize(e) {
    const val = e.currentTarget.dataset.val;
    this.setData({
      'drawerFilter.size': val
    });
  },

  // 切换抽屉授权与特性
  onSelectDrawerLicense(e) {
    const val = e.currentTarget.dataset.val;
    this.setData({
      'drawerFilter.license': val
    });
  },

  // 重置抽屉筛选
  onResetDrawer() {
    this.setData({
      drawerFilter: {
        systems: ['win', 'mac'],
        size: 'all',
        license: 'all'
      },
      drawerResultCount: 168
    });
    showToast('筛选条件已重置');
  },

  // 应用抽屉筛选
  applyFilter() {
    this.setData({ showDrawer: false });
    showToast('多维筛选已生效');
  },

  // 点击卡片或获取按钮，跳转至详情页
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  },

  // 底部快捷通道：直达求资源工单页面
  onRequestResourceTap() {
    wx.navigateTo({
      url: '/pages/request/request'
    });
  }
});
