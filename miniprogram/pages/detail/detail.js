const { copyToClipboard, showToast } = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    resource: null,
    activeTab: 'features',
    showDownloadModal: false,
    isFav: false,
    favCount: '0'
  },

  async onLoad(options) {
    const id = (options && options.id) ? options.id.toLowerCase() : 'picgo';

    wx.showLoading({ title: '正在加载资源...', mask: false });
    const res = await api.getResourceDetail(id);
    wx.hideLoading();

    if (res && res.code === 0 && res.data) {
      this.setData({
        resource: res.data,
        favCount: res.data.favCount || '1.2k'
      });
      wx.setNavigationBarTitle({
        title: res.data.title
      });
    } else {
      showToast('数据库未检索到该资源详情');
    }
  },

  setTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  openDownload() {
    this.setData({ showDownloadModal: true });
    // 调用下载流水记录接口
    if (this.data.resource && this.data.resource.id) {
      api.getResourceDownload(this.data.resource.id);
    }
  },

  closeDownload() {
    this.setData({ showDownloadModal: false });
  },

  toggleFav() {
    const nextFav = !this.data.isFav;
    this.setData({
      isFav: nextFav,
      favCount: nextFav ? '2.4k+' : '2.4k'
    });
    showToast(nextFav ? '已收藏此资源' : '已取消收藏');
    if (this.data.resource && this.data.resource.id) {
      api.toggleResourceFav(this.data.resource.id, nextFav);
    }
  },

  onPosterTap() {
    showToast('正在生成资源海报...');
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.src;
    const urls = (this.data.resource && this.data.resource.images) || [current];
    wx.previewImage({
      current,
      urls
    });
  },

  onReportTap() {
    const { resource } = this.data;
    if (!resource) return;
    wx.navigateTo({
      url: `/pages/feedback/feedback?id=${resource.id}&title=${encodeURIComponent(resource.title)}&category=${encodeURIComponent(resource.category || '开发工具')}&icon=${encodeURIComponent(resource.icon || '')}`
    });
  },

  goToFeedback() {
    this.setData({ showDownloadModal: false });
    const { resource } = this.data;
    if (!resource) return;
    wx.navigateTo({
      url: `/pages/feedback/feedback?id=${resource.id}&title=${encodeURIComponent(resource.title)}&category=${encodeURIComponent(resource.category || '开发工具')}&icon=${encodeURIComponent(resource.icon || '')}`
    });
  },

  copyLink() {
    if (!this.data.resource) return;
    const { panUrl, pwd, title } = this.data.resource;
    const text = `【枫的藏宝阁】${title} 下载直链：${panUrl} 提取码：${pwd}`;
    copyToClipboard(text, '网盘直链与密码已复制！');
  },

  copyPwd() {
    if (!this.data.resource) return;
    copyToClipboard(this.data.resource.pwd, '提取码已复制');
  }
});
