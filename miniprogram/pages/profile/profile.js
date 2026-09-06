const { copyToClipboard, showToast } = require('../../utils/util.js');

Page({
  data: {
    userInfo: {
      nickName: '极客探索者_7092',
      uid: '8932014',
      level: '普通会员',
      downloadCount: 5,
      favCount: 12,
      ticketCount: 0,
      points: 128
    }
  },

  onLoad() {
    console.log('个人中心加载');
  },

  copyUID() {
    copyToClipboard(this.data.userInfo.uid, 'UID 已复制');
  },

  viewHistory() {
    showToast('暂无更多离线转存记录');
  },

  clearCache() {
    wx.showModal({
      title: '清理缓存',
      content: '确定要清除小程序本地缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          showToast('缓存已清空', 'success');
        }
      }
    });
  },

  contactAdmin() {
    showToast('可通过官方公众号或工单联系客服');
  }
});
