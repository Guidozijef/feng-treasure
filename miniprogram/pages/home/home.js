const { showToast } = require('../../utils/util.js');

Page({
  data: {
    searchKeyword: '',
    topPicks: [
      {
        id: 'picgo',
        title: 'PicGo 图床利器',
        version: 'v2.4.0',
        tag: 'TOP 1',
        desc: '好用的云存储图床管理工具，支持一键上传与剪贴板自动格式转换。',
        size: '48 MB',
        rating: '4.9',
        downloads: '1.2w+',
        icon: '🖼️'
      },
      {
        id: 'typora',
        title: 'Typora 经典版',
        version: 'v0.11.18',
        tag: 'TOP 2',
        desc: '所见即所得 Markdown 神级写作工具，离线可用，原生中文支持。',
        size: '62 MB',
        rating: '4.9',
        downloads: '8.7w+',
        icon: '📝'
      }
    ],
    feedList: [
      {
        id: 'trans',
        title: '沉浸式翻译 Pro 增强脚本',
        version: 'v1.12.0',
        badge: '更新',
        desc: '双语网页对照、PDF 智能排版翻译与 Epub 电子书制作。',
        size: '4.2 MB',
        rating: '4.9',
        platform: '全平台插件'
      },
      {
        id: 'python408',
        title: 'Python 实战逆向与爬虫课件包',
        version: '2025 完整版',
        badge: '热搜',
        desc: '包含 JS 逆向、安卓反编译案例源码与真实练习靶场环境。',
        size: '1.8 GB',
        rating: '4.8',
        platform: '源码教程'
      },
      {
        id: 'docker',
        title: 'Docker Desktop 优化绿色版',
        version: 'v4.28',
        badge: '开发者必备',
        desc: '免复杂安装配置，已配置国内多源加速镜像，内存开销优化。',
        size: '520 MB',
        rating: '4.8',
        platform: 'Mac / Win'
      }
    ]
  },

  onLoad() {
    console.log('首页加载完成');
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
      showToast('已刷新最新资源');
    }, 800);
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    const kw = this.data.searchKeyword.trim();
    if (!kw) {
      showToast('请输入关键词检索');
      return;
    }
    showToast(`正在检索: ${kw}`);
  },

  goToCategory(e) {
    const type = e.currentTarget.dataset.type;
    wx.switchTab({
      url: '/pages/category/category'
    });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  }
});
