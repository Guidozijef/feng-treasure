const { showToast } = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'soar', // soar, week, new, rating
    activeCategory: 'all',
    rankList: [
      {
        rank: '04',
        id: 'windterm',
        title: 'WindTerm 极客终端',
        version: 'v2.6.1',
        tag: '开源专业版',
        badge: '极速',
        change: '+8',
        changeType: 'up',
        heat: '84.2w',
        rating: '4.9',
        iconBg: '#eff6ff',
        icon: '💻',
        isFav: true
      },
      {
        rank: '05',
        id: 'pixpin',
        title: 'PixPin 截图/长截图',
        version: 'v1.8.9.2',
        tag: '离线纯净',
        badge: '黑马',
        change: 'NEW',
        changeType: 'new',
        heat: '79.5w',
        rating: '4.9',
        iconBg: '#fdf2f8',
        icon: '📌',
        isFav: false
      },
      {
        rank: '06',
        id: 'vscode',
        title: 'VS Code 极客优化版',
        version: 'v1.94',
        tag: '内置中文+AI',
        badge: '必备',
        change: '+2',
        changeType: 'up',
        heat: '72.1w',
        rating: '5.0',
        iconBg: '#f0fdf4',
        icon: '⚡',
        isFav: true
      },
      {
        rank: '07',
        id: 'cs408',
        title: '计算机考研 408 知识体系思维导图',
        version: '2025 黄金版',
        tag: 'PDF高清矢量',
        badge: '高分',
        change: '持平',
        changeType: 'flat',
        heat: '68.0w',
        rating: '4.8',
        iconBg: '#fffbeb',
        icon: '🎓',
        isFav: false
      },
      {
        rank: '08',
        id: 'bandizip',
        title: 'Bandizip 经典无广告终结版',
        version: 'v6.29',
        tag: '永久免费',
        badge: '口碑',
        change: '-1',
        changeType: 'down',
        heat: '63.4w',
        rating: '4.9',
        iconBg: '#f5f3ff',
        icon: '📦',
        isFav: false
      }
    ]
  },

  onLoad() {
    console.log('热门页面加载');
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
      showToast('热度指数已更新');
    }, 800);
  },

  setTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  setCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCategory: cat });
  },

  toggleFav(e) {
    const id = e.currentTarget.dataset.id;
    const rankList = this.data.rankList.map(item => {
      if (item.id === id) {
        const nextFav = !item.isFav;
        showToast(nextFav ? '已加入我的收藏' : '已取消收藏');
        return { ...item, isFav: nextFav };
      }
      return item;
    });
    this.setData({ rankList });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  }
});
