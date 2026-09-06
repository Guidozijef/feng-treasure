const { showToast } = require('../../utils/util.js');

Page({
  data: {
    activeNav: 'pc',
    showDrawer: false,
    selectedSystem: ['win', 'mac'],
    activeSort: 'comprehensive',
    items: [
      {
        id: 'picgo-cat',
        title: 'PicGo 图床利器',
        version: 'v2.4.0',
        subtitle: '免安装绿色版',
        desc: '好用的云存储图床管理工具，支持一键上传与剪贴板自动格式转换。',
        size: '48 MB',
        rating: '4.9',
        platform: '全平台免安装',
        icon: '🖼️'
      },
      {
        id: 'docker-cat',
        title: 'Docker Desktop 优化版',
        version: 'v4.28',
        subtitle: '推荐',
        desc: '开发必备容器虚拟化环境，适配 M1/M2/M3 及 Win11 WSL2 镜像调优。',
        size: '520 MB',
        rating: '4.8',
        platform: 'Mac / Win',
        icon: '🐳'
      },
      {
        id: 'snipaste-cat',
        title: 'Snipaste 截图贴图神器',
        version: 'v2.8.8 Pro',
        subtitle: '离线纯净',
        desc: '极速截图、便捷贴图置顶、取色器与高级文字标记标注。',
        size: '16.5 MB',
        rating: '5.0',
        platform: 'Win / Mac',
        icon: '✂️'
      }
    ]
  },

  onLoad() {
    console.log('分类页加载');
  },

  switchNav(e) {
    const nav = e.currentTarget.dataset.nav;
    this.setData({ activeNav: nav });
  },

  toggleDrawer() {
    this.setData({ showDrawer: !this.data.showDrawer });
  },

  closeDrawer() {
    this.setData({ showDrawer: false });
  },

  setSort(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({ activeSort: sort });
    showToast('已切换排序');
  },

  applyFilter() {
    this.setData({ showDrawer: false });
    showToast('筛选已生效');
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  }
});
