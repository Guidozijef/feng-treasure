const { showToast, copyToClipboard } = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    // 顶部安全区与自定义导航栏高度
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 一级主维度 Tabs
    tabs: [
      { id: 'soar', name: '总榜飙升', hasIcon: true },
      { id: 'week', name: '本周热门' },
      { id: 'new', name: '今日新上' },
      { id: 'rating', name: '评分最高' }
    ],
    activeTab: 'soar',

    // 二级细分类目
    subCategories: [
      { id: 'all', name: '全部类目' },
      { id: 'pc', name: '电脑应用' },
      { id: 'tools', name: '实用工具' },
      { id: 'study', name: '学霸考研' },
      { id: 'dev', name: '开源源码' }
    ],
    activeCategory: 'all',

    // TOP 1 冠领跑卡片 (从数据库动态加载)
    top1: null,

    // TOP 2 & TOP 3 双列 (从数据库动态加载)
    top2: null,
    top3: null,

    // 4 - 10 上升最快热度榜单 (从数据库动态加载)
    rankList: [],

    // 资源获取弹窗
    showModal: false,
    selectedResource: null
  },

  onLoad() {
    this.initNavBarLayout();
    this.loadRankings(this.data.activeTab, this.data.activeCategory);
  },

  async onPullDownRefresh() {
    await this.loadRankings(this.data.activeTab, this.data.activeCategory);
    wx.stopPullDownRefresh();
    showToast('全网热度指数已更新', 'success');
  },

  async loadRankings(tab, cat) {
    const res = await api.getHotRankings(tab, cat);
    if (res && res.code === 0 && res.data) {
      const { top1, top2, top3, rankList } = res.data;
      const updates = {};
      if (top1) updates.top1 = top1;
      if (top2) updates.top2 = top2;
      if (top3) updates.top3 = top3;
      if (rankList && rankList.length) updates.rankList = rankList;
      this.setData(updates);
    }
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

  setTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    showToast(`已切换至「${tab === 'soar' ? '总榜·飙升' : tab === 'week' ? '本周热门' : tab === 'new' ? '今日新上' : '评分最高'}」`);
    this.loadRankings(tab, this.data.activeCategory);
  },

  setCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCategory: cat });
    this.loadRankings(this.data.activeTab, cat);
  },

  onIndexRuleTap() {
    wx.showModal({
      title: '极客全网热度指数算法',
      content: '基于近 7 日内全网社群下载量（权重 40%）、用户点赞评分（权重 30%）、直链解析成功率（权重 20%）及收藏转存增长速率（权重 10%）综合加权计算，每小时自动准点结算刷新。',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#3B82F6'
    });
  },

  onHallOfFameTap() {
    wx.showModal({
      title: '历史名人堂',
      content: '历史名人堂记录了在风云榜蝉联榜首超过 30 天的史诗级神级神器（如 VS Code、PicGo、PotPlayer 等）。',
      showCancel: false,
      confirmText: '敬请期待',
      confirmColor: '#3B82F6'
    });
  },

  onWishTap() {
    wx.navigateTo({
      url: '/pages/request/request'
    });
  },

  // 点击「获取」均先跳转至详情页
  openResourceModal(e) {
    const id = e.currentTarget.dataset.id || 'picgo';
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  closeModal() {
    this.setData({
      showModal: false,
      selectedResource: null
    });
  },

  copyResourceLink() {
    const res = this.data.selectedResource;
    if (!res) return;
    const copyContent = `${res.title || res.fullTitle}\n网盘链接: ${res.link}\n提取码: ${res.code || '无'}\n来源: 枫的藏宝阁`;
    copyToClipboard(copyContent, '下载直链与提取码已复制');
    this.closeModal();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  }
});
