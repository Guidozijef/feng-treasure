const { showToast } = require('../../utils/util.js');
const api = require('../../utils/api.js');

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

    // 顶部横向快速标签滚动栏 (从 PocketBase 动态加载)
    quickTags: [],

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

    // 抽屉筛选条件
    drawerFilter: {
      systems: ['win', 'mac'],
      size: 'all',
      license: 'all'
    },
    drawerResultCount: 0
  },

  async onLoad() {
    this.initNavBarLayout();
    await this.initCategoryPage();
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

    this.setData({
      categories,
      quickTags,
      activeNav: firstNav
    });

    await this.loadCategoryScenes(firstNav);
    await this.refreshContentData();
  },

  // 加载指定大分类下的细分场景
  async loadCategoryScenes(navId) {
    const res = await api.getSubScenes(navId);
    const subScenes = (res && res.code === 0 && Array.isArray(res.data)) ? res.data : [];
    const firstSceneId = (subScenes[0] && subScenes[0].id) ? subScenes[0].id : '';

    this.setData({
      subScenes,
      activeSceneId: firstSceneId
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
    this.refreshContentData();
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
    this.refreshContentData();
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
      this.refreshContentData();
    });
  },

  // 根据当前 activeNav 及条件从 PocketBase 数据库刷新资源列表
  async refreshContentData() {
    const nav = this.data.activeNav;
    const scene = this.data.activeSceneId;
    const sort = this.data.activeSort;

    const res = await api.getResources({
      category: nav,
      scene,
      sort
    });

    if (res && res.code === 0 && Array.isArray(res.data)) {
      this.setData({
        items: res.data,
        totalCount: res.total !== undefined ? res.total : res.data.length,
        drawerResultCount: res.total !== undefined ? res.total : res.data.length
      });
    }
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
      'drawerFilter.systems': systems
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
      }
    });
    this.refreshContentData();
    showToast('筛选条件已重置');
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
