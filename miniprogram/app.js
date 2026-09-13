// 枫的藏宝阁微信小程序全局应用逻辑
App({
  globalData: {
    userInfo: {
      nickName: '极客探索者',
      uid: '',
      level: '普通用户',
      points: 128
    },
    systemInfo: null,
    favorites: ['picgo-top1', 'vscode-6']
  },

  onLaunch() {
    // 获取设备信息与系统状态栏
    try {
      const res = wx.getSystemInfoSync();
      this.globalData.systemInfo = res;
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  }
});
