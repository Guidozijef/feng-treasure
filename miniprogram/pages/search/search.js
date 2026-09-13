const { showToast } = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    // 搜索输入内容
    searchKeyword: '',

    // 排序类型: 'composite' (综合) | 'latest' (最新发布) | 'download' (下载最多)
    sortType: 'composite',

    // 筛选出的资源列表 (从 PocketBase 数据库动态获取)
    filteredList: [],

    // 匹配的资源数量
    totalCount: 0
  },

  onLoad(options) {
    let kw = '';
    if (options && options.keyword !== undefined) {
      kw = decodeURIComponent(options.keyword);
    }
    this.setData({ searchKeyword: kw }, () => {
      if (kw) {
        this.executeFilter();
      }
    });
  },

  // 监听输入
  onSearchInput(e) {
    const kw = e.detail.value;
    this.setData({ searchKeyword: kw });
  },

  // 清除输入
  onClearInput() {
    this.setData({ searchKeyword: '', filteredList: [], totalCount: 0 });
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

  // 核心检索：直接调用 PocketBase 数据库模糊搜索
  async executeFilter() {
    const { searchKeyword, sortType } = this.data;
    const kw = searchKeyword.trim();

    if (!kw) {
      this.setData({ filteredList: [], totalCount: 0 });
      return;
    }

    wx.showLoading({ title: '检索数据库...', mask: false });
    const res = await api.searchResources(kw, sortType);
    wx.hideLoading();

    if (res && res.code === 0 && Array.isArray(res.data)) {
      const apiList = res.data.map(item => ({
        id: item.id,
        title: item.title,
        shortTitle: item.title.slice(0, 18) + (item.title.length > 18 ? '...' : ''),
        icon: item.icon,
        iconBg: item.iconBg || '#eef6ff',
        version: item.versionBadge || item.version || '',
        versionClass: 'ver-blue',
        tags: item.tags || [{ text: '网盘直链', type: 'tag-blue' }],
        rating: String(item.rating || '4.9'),
        size: item.size || '32MB',
        channels: '网盘高速直达',
        btnText: '获取',
        btnType: 'solid',
        downloads: item.downloads || 0,
        publishDate: item.publishDate || ''
      }));

      this.setData({
        filteredList: apiList,
        totalCount: res.total !== undefined ? res.total : apiList.length
      });
    } else {
      this.setData({ filteredList: [], totalCount: 0 });
    }
  },

  // 点击资源卡片或右侧获取/查看按钮
  onResourceTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  },

  // 底部虚线卡片：跳转求资源工单页面
  onRequestResourceTap() {
    wx.navigateTo({
      url: '/pages/request/request'
    });
  }
});
