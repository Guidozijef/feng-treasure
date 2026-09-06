const { copyToClipboard, showToast } = require('../../utils/util.js');

Page({
  data: {
    resource: {
      id: 'picgo',
      title: 'PicGo 图床利器',
      version: 'v2.4.0 稳定绿色版',
      desc: '好用的云存储图床管理工具，支持一键上传与剪贴板自动格式转换。免去繁琐安装与广告推送。',
      size: '48.5 MB',
      platform: '全平台 (Win/Mac/Linux)',
      rating: '4.9',
      downloads: '1.2w+ 次',
      panUrl: 'https://pan.quark.cn/s/picgo_v240_free',
      pwd: '88ab'
    },
    activeTab: 'features',
    showDownloadModal: false,
    isFav: false
  },

  onLoad(options) {
    console.log('详情页加载，ID:', options.id);
  },

  setTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  openDownload() {
    this.setData({ showDownloadModal: true });
  },

  closeDownload() {
    this.setData({ showDownloadModal: false });
  },

  toggleFav() {
    const nextFav = !this.data.isFav;
    this.setData({ isFav: nextFav });
    showToast(nextFav ? '已收藏此资源' : '已取消收藏');
  },

  copyLink() {
    const { panUrl, pwd } = this.data.resource;
    const text = `【极客资源盒】下载链接：${panUrl} 提取码：${pwd}`;
    copyToClipboard(text, '网盘直链与密码已复制！');
  },

  copyPwd() {
    copyToClipboard(this.data.resource.pwd, '提取码已复制');
  }
});
