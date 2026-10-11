const { showToast } = require('../../utils/util.js');
const api = require('../../utils/api.js');

const SYSTEM_LABELS = {
  win: 'Windows',
  mac: 'macOS',
  web: '网页端',
  linux: 'Linux'
};

const LICENSE_LABELS = {
  green: '绿色免安装',
  official: '官方原版',
  free: '开源免费',
  vip: 'VIP特权版'
};

const SIZE_LABELS = {
  small: '<50MB 轻量',
  medium: '50-500MB',
  large: '500MB-2GB',
  xlarge: '>2GB 超大'
};

const PWD_LABELS = {
  free: '免提取码',
  has_pwd: '需提取码'
};

Page({
  data: {
    // 导航栏自适应布局参数
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 搜索输入内容
    searchKeyword: '',

    // 左侧选中的导航分类 key
    activeNav: 'pc',

    // 左侧分类列表 (从 PocketBase 动态加载)
    categories: [],

    // 抽屉可选的精选标签池（从 quick_tags 库提取或内置高频标签）
    availableFilterTags: [
      '网盘直链', '纯净无广告', '中文汉化', '解压即用', 
      '附安装教程', '无水印导出', '4K超清', 'Win11适配', 
      'M芯片适配', '商用免费字库', '源码脚手架', '自动化脚本'
    ],

    // 右侧细分场景标签列表 (从 PocketBase 对应分类动态加载)
    subScenes: [],

    // 当前选中的场景标签 id
    activeSceneId: '',

    // 排序方式: 'comprehensive' (综合排序) | 'downloads' (下载最多) | 'rating' (按评分)
    activeSort: 'comprehensive',

    // 当前分类下的资源总数
    totalCount: 0,

    // 当前渲染的资源列表 (从 PocketBase 动态加载)
    items: [],

    // 高级筛选抽屉显示状态
    showDrawer: false,

    // 抽屉多维筛选条件
    drawerFilter: {
      systems: [],
      license: 'all',
      selectedTags: [],
      size: 'all',
      pwdType: 'all',
      minRating: 'all'
    },
    // 当前已应用的筛选标签（用于在页面顶部展示可单独删除的胶囊）
    activeFilterTags: [],
    activeFilterCount: 0,
    drawerResultCount: 0
  },

  async onLoad() {
    this.initNavBarLayout();
    await this.initCategoryPage();
  },

  async onShow() {
    const targetNav = wx.getStorageSync('selectedCategory');
    if (targetNav) {
      wx.removeStorageSync('selectedCategory');
      if (this.data.activeNav !== targetNav) {
        this.setData({ activeNav: targetNav });
        await this.loadCategoryScenes(targetNav);
        await this.refreshContentData();
      }
    }
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

  // 页面初始化：从数据库加载分类、标签和初次资源
  async initCategoryPage() {
    const [catRes, tagRes] = await Promise.all([
      api.getCategories(),
      api.getQuickTags()
    ]);

    const categories = (catRes && catRes.code === 0 && catRes.data) ? catRes.data : [];
    const quickTags = (tagRes && tagRes.code === 0 && tagRes.data) ? tagRes.data : [];

    const firstNav = (categories[0] && categories[0].id) ? categories[0].id : 'pc';

    // 提取动态热门标签供抽屉使用
    let availableFilterTags = this.data.availableFilterTags;
    if (quickTags && quickTags.length > 0) {
      availableFilterTags = quickTags.map(t => t.name).slice(0, 16);
    }

    this.setData({
      categories,
      availableFilterTags,
      activeNav: firstNav
    });

    await this.loadCategoryScenes(firstNav);
    await this.refreshContentData();
  },

  // 加载指定大分类下的关联细分标签
  async loadCategoryScenes(navId) {
    const res = await api.getSubScenes(navId);
    const subScenes = (res && res.code === 0 && Array.isArray(res.data)) ? res.data : [];

    // 默认展示该大分类下的全部资源
    this.setData({
      subScenes: subScenes.map(s => ({ ...s, active: false })),
      activeSceneId: 'all'
    });
  },

  // 顶部返回箭头点击
  onBackTap() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 搜索相关交互
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' });
  },

  onSearchConfirm(e) {
    const raw = (e && e.detail && e.detail.value !== undefined) 
      ? e.detail.value 
      : this.data.searchKeyword;
    const kw = (raw || '').trim();
    wx.navigateTo({
      url: kw ? `/pages/search/search?keyword=${encodeURIComponent(kw)}` : '/pages/search/search'
    });
  },

  // 切换左侧大分类
  async switchNav(e) {
    const nav = e.currentTarget.dataset.nav;
    if (this.data.activeNav === nav) return;

    this.setData({ activeNav: nav });
    await this.loadCategoryScenes(nav);
    await this.refreshContentData();
  },

  // 切换细分标签
  onSwitchScene(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    const targetTag = (id === 'all') ? 'all' : (name || id);

    const subScenes = this.data.subScenes.map(s => ({
      ...s,
      active: (id !== 'all' && (s.id === id || s.name === name))
    }));
    this.setData({
      activeSceneId: targetTag,
      subScenes
    });
    this.refreshContentData();
  },

  // 点击「高级筛选 >」直接打开高级筛选抽屉
  onAllTagsTap() {
    this.toggleDrawer();
  },

  // 切换排序方式
  setSort(e) {
    const sort = e.currentTarget.dataset.sort;
    if (this.data.activeSort === sort) return;

    this.setData({ activeSort: sort }, () => {
      this.refreshContentData();
    });
  },

  // 收集当前筛选参数并调用 API 刷新资源列表
  async refreshContentData() {
    const nav = this.data.activeNav;
    const scene = this.data.activeSceneId;
    const sort = this.data.activeSort;
    const df = this.data.drawerFilter;

    const params = {
      category: nav,
      sort: sort
    };

    if (scene && scene !== 'all') {
      params.scene = scene;
    }

    if (df.systems && df.systems.length > 0) {
      params.systems = df.systems.join(',');
    }
    if (df.license && df.license !== 'all') {
      params.license = df.license;
    }
    if (df.selectedTags && df.selectedTags.length > 0) {
      params.tags = df.selectedTags.join(',');
    }
    if (df.size && df.size !== 'all') {
      params.size = df.size;
    }
    if (df.pwdType && df.pwdType !== 'all') {
      params.pwdType = df.pwdType;
    }
    if (df.minRating && df.minRating !== 'all') {
      params.minRating = df.minRating;
    }

    const res = await api.getResources(params);

    if (res && res.code === 0 && Array.isArray(res.data)) {
      this.setData({
        items: res.data,
        totalCount: res.total !== undefined ? res.total : res.data.length,
        drawerResultCount: res.total !== undefined ? res.total : res.data.length
      });
    }
    this.updateActiveFilterSummary();
  },

  // 抽屉内实时预览匹配款数
  async previewDrawerCount() {
    const nav = this.data.activeNav;
    const scene = this.data.activeSceneId;
    const sort = this.data.activeSort;
    const df = this.data.drawerFilter;

    const params = {
      category: nav,
      scene: scene,
      sort: sort
    };

    if (df.systems && df.systems.length > 0) params.systems = df.systems.join(',');
    if (df.license && df.license !== 'all') params.license = df.license;
    if (df.selectedTags && df.selectedTags.length > 0) params.tags = df.selectedTags.join(',');
    if (df.size && df.size !== 'all') params.size = df.size;
    if (df.pwdType && df.pwdType !== 'all') params.pwdType = df.pwdType;
    if (df.minRating && df.minRating !== 'all') params.minRating = df.minRating;

    const res = await api.getResources(params);
    if (res && res.code === 0 && res.total !== undefined) {
      this.setData({ drawerResultCount: res.total });
    }
  },

  // 更新当前已选中的筛选标签摘要（用于顶部胶囊展示）
  updateActiveFilterSummary() {
    const df = this.data.drawerFilter;
    const activeTags = [];

    if (df.systems && df.systems.length > 0) {
      df.systems.forEach(s => {
        activeTags.push({
          key: `sys_${s}`,
          type: 'system',
          val: s,
          label: SYSTEM_LABELS[s] || s
        });
      });
    }

    if (df.license && df.license !== 'all') {
      activeTags.push({
        key: `lic_${df.license}`,
        type: 'license',
        val: df.license,
        label: LICENSE_LABELS[df.license] || df.license
      });
    }

    if (df.selectedTags && df.selectedTags.length > 0) {
      df.selectedTags.forEach(t => {
        activeTags.push({
          key: `tag_${t}`,
          type: 'tag',
          val: t,
          label: t
        });
      });
    }

    if (df.size && df.size !== 'all') {
      activeTags.push({
        key: `size_${df.size}`,
        type: 'size',
        val: df.size,
        label: SIZE_LABELS[df.size] || df.size
      });
    }

    if (df.pwdType && df.pwdType !== 'all') {
      activeTags.push({
        key: `pwd_${df.pwdType}`,
        type: 'pwdType',
        val: df.pwdType,
        label: PWD_LABELS[df.pwdType] || df.pwdType
      });
    }

    if (df.minRating && df.minRating !== 'all') {
      activeTags.push({
        key: `rate_${df.minRating}`,
        type: 'minRating',
        val: df.minRating,
        label: `★ ${df.minRating}分+`
      });
    }

    this.setData({
      activeFilterTags: activeTags,
      activeFilterCount: activeTags.length
    });
  },

  // 打开/关闭高级筛选抽屉
  toggleDrawer() {
    const nextState = !this.data.showDrawer;
    this.setData({ showDrawer: nextState });
    if (nextState) {
      this.previewDrawerCount();
    }
  },

  closeDrawer() {
    this.setData({ showDrawer: false });
  },

  // 切换抽屉系统平台多选
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
      'drawerFilter.systems': systems
    }, () => {
      this.previewDrawerCount();
    });
  },

  // 切换抽屉版本授权单选
  onSelectDrawerLicense(e) {
    const val = e.currentTarget.dataset.val;
    this.setData({
      'drawerFilter.license': val
    }, () => {
      this.previewDrawerCount();
    });
  },

  // 切换抽屉特色标签多选
  onToggleDrawerTag(e) {
    const val = e.currentTarget.dataset.val;
    let tags = [...this.data.drawerFilter.selectedTags];
    const index = tags.indexOf(val);
    if (index > -1) {
      tags.splice(index, 1);
    } else {
      tags.push(val);
    }
    this.setData({
      'drawerFilter.selectedTags': tags
    }, () => {
      this.previewDrawerCount();
    });
  },

  // 切换抽屉文件体积单选
  onSelectDrawerSize(e) {
    const val = e.currentTarget.dataset.val;
    this.setData({
      'drawerFilter.size': val
    }, () => {
      this.previewDrawerCount();
    });
  },

  // 切换抽屉提取码模式
  onSelectDrawerPwdType(e) {
    const val = e.currentTarget.dataset.val;
    this.setData({
      'drawerFilter.pwdType': val
    }, () => {
      this.previewDrawerCount();
    });
  },

  // 切换抽屉好评评分
  onSelectDrawerRating(e) {
    const val = e.currentTarget.dataset.val;
    this.setData({
      'drawerFilter.minRating': val
    }, () => {
      this.previewDrawerCount();
    });
  },

  // 重置所有筛选条件
  onResetDrawer() {
    this.setData({
      drawerFilter: {
        systems: [],
        license: 'all',
        selectedTags: [],
        size: 'all',
        pwdType: 'all',
        minRating: 'all'
      }
    }, () => {
      this.refreshContentData();
      showToast('筛选条件已重置');
    });
  },

  // 从页面顶部已选胶囊中单独移除某项筛选
  removeFilterTag(e) {
    const { type, val } = e.currentTarget.dataset;
    const df = { ...this.data.drawerFilter };
    if (type === 'system') {
      df.systems = (df.systems || []).filter(s => s !== val);
    } else if (type === 'license') {
      df.license = 'all';
    } else if (type === 'tag') {
      df.selectedTags = (df.selectedTags || []).filter(t => t !== val);
    } else if (type === 'size') {
      df.size = 'all';
    } else if (type === 'pwdType') {
      df.pwdType = 'all';
    } else if (type === 'minRating') {
      df.minRating = 'all';
    }
    this.setData({ drawerFilter: df }, () => {
      this.refreshContentData();
    });
  },

  // 应用抽屉筛选
  applyFilter() {
    this.setData({ showDrawer: false });
    this.refreshContentData();
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
