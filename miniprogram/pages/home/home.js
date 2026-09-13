const { showToast, copyToClipboard } = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    // 顶部安全区与导航栏高度
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 搜索关键词
    searchKeyword: '',
    searchPlaceholder: '大家都在搜：Notion中文增强包、考研西综...',

    // Banner 轮播数据（从数据库动态载入）
    bannerCurrent: 0,
    bannerList: [],

    // 金刚区分类（从数据库动态载入）
    categories: [],

    // 今日更新广播（从数据库动态载入）
    noticeText: '',

    // 热门飙升榜数据（从数据库动态载入）
    topPicks: [],

    // 综合精选 Tabs
    tabs: [
      { id: 'all', name: '综合精选' },
      { id: 'new', name: '最新发布' },
      { id: 'essential', name: '装机必备' },
      { id: 'direct', name: '网盘直链' }
    ],
    activeTab: 'all',
    totalCount: '0',

    // 资源列表数据（从数据库动态载入）
    feedList: [],

    // 获取资源弹窗交互状态
    showModal: false,
    selectedResource: null
  },

  onLoad() {
    this.initNavBarLayout();
    this.loadHomeData();
  },

  async onPullDownRefresh() {
    await this.loadHomeData();
    wx.stopPullDownRefresh();
    showToast('已同步全网最新资源', 'success');
  },

  async loadHomeData() {
    const [overviewRes, catRes] = await Promise.all([
      api.getHomeOverview(),
      api.getCategories()
    ]);
    const updates = {};
    if (overviewRes && overviewRes.code === 0 && overviewRes.data) {
      const { banners, announcements, topPicks, feedList, stats } = overviewRes.data;
      updates.bannerList = banners || [];
      updates.noticeText = (announcements && announcements.length) ? announcements[0].content : '';
      updates.topPicks = topPicks || [];
      updates.feedList = feedList || [];
      if (stats && stats.totalResources) updates.totalCount = `${stats.totalResources}+`;
    }
    if (catRes && catRes.code === 0 && Array.isArray(catRes.data)) {
      updates.categories = catRes.data;
    }
    this.setData(updates);
  },

  // 计算自定义导航栏尺寸以适配不同机型状态栏与微信胶囊
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
      console.error('初始化导航栏尺寸异常', e);
    }
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

  onFilterTap() {
    wx.showActionSheet({
      itemList: ['按下载热度排序', '按最新更新时间', '按网盘类型筛选', '仅看开源免安装'],
      success: (res) => {
        showToast('已为您重新筛选资源排序');
      }
    });
  },

  // Banner 轮播切换联动
  onBannerChange(e) {
    this.setData({
      bannerCurrent: e.detail.current
    });
  },

  // 分类跳转
  goToCategory(e) {
    const type = e.currentTarget.dataset.type;
    wx.switchTab({
      url: '/pages/category/category'
    });
  },

  // 跳转热门页面
  goToHot() {
    wx.switchTab({
      url: '/pages/hot/hot'
    });
  },

  // 跳转详情页
  goToDetail(e) {
    const id = e.currentTarget.dataset.id || 'picgo';
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 今日广播点击
  onNoticeTap() {
    wx.showModal({
      title: '📢 今日资源更新快报',
      content: '今日已收录包括 Docker Desktop 镜像加速版、沉浸式翻译 Pro、2025 商用字体包等 38 款优质生产力工具，均已通过安全无毒检测。',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#1677ff'
    });
  },

  // 综合精选 Tabs 切换
  async onTabChange(e) {
    const tabId = e.currentTarget.dataset.id;
    if (tabId === this.data.activeTab) return;
    this.setData({ activeTab: tabId });
    showToast(`已切换至「${e.currentTarget.dataset.name}」`);
    const res = await api.getHomeRecommendations(tabId);
    if (res && res.code === 0 && Array.isArray(res.data) && res.data.length > 0) {
      this.setData({ feedList: res.data });
    }
  },

  // 点击「获取」按钮均先进入详情页面
  openGetResource(e) {
    const item = e.currentTarget.dataset.item;
    const id = (item && item.id) ? item.id : 'picgo';
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  closeModal() {
    this.setData({
      showModal: false
    });
  },

  // 复制提取码或下载直链
  copyResourceLink() {
    const res = this.data.selectedResource;
    if (!res) return;
    const content = `【枫的藏宝阁】${res.title}\n下载直链：${res.link}\n提取码：${res.code || 'geek'}\n请复制后在浏览器或网盘App打开转存。`;
    copyToClipboard(content, '下载信息已复制');
    this.closeModal();
  }
});
