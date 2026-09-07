const { copyToClipboard, showToast } = require('../../utils/util.js');

Page({
  data: {
    // 顶部安全区与导航栏高度
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 用户核心数据
    userInfo: {
      nickName: 'Geek_Arthur',
      vipBadge: '⚡ SVIP',
      uid: '8932014',
      avatar: '/images/default_avatar.svg',
      privilegeStatus: '极客永久尊享特权 · 独家节点生效中',
      downloadCount: 48,
      favCount: 126,
      ticketCount: 2,
      ticketHasNew: true,
      points: '1,280'
    },

    // 资产与工具 4 项
    assetTools: [
      { id: 'history', title: '获取历史', icon: '/images/tool_history.svg', bg: '#eff6ff' },
      { id: 'fav', title: '我的收藏', icon: '/images/tool_fav.svg', bg: '#fffbeb' },
      { id: 'ticket', title: '求资源工单', icon: '/images/tool_ticket.svg', bg: '#ecfdf5' },
      { id: 'redeem', title: '激活兑换', icon: '/images/tool_gift.svg', bg: '#f5f3ff' }
    ],

    // 任务打卡状态
    hasCheckedIn: true
  },

  onLoad() {
    this.initNavBarLayout();
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
      showToast('个人资产与特权已同步', 'success');
    }, 600);
  },

  // 计算自定义导航栏尺寸
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

  copyUID() {
    copyToClipboard(this.data.userInfo.uid, 'UID 已复制到剪切板');
  },

  openSettings() {
    wx.showActionSheet({
      itemList: ['账号安全与绑定', '清理本地临时缓存', '退出登录'],
      success: (res) => {
        if (res.tapIndex === 1) {
          wx.clearStorageSync();
          showToast('本地缓存已深度清理', 'success');
        } else if (res.tapIndex === 0) {
          showToast('当前极客账号已绑定微信安全凭据');
        }
      }
    });
  },

  openPrivilegeDetails() {
    wx.showModal({
      title: '极客 SVIP 专属特权',
      content: '1. 全网直链满速不限流下载\n2. 每日无限次直链解析\n3. 失效资源 10 分钟极速专人补档\n4. 独家 VIP 开发者绿色工具包首发获取',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#0f5bd8'
    });
  },

  onRenewVip() {
    wx.showModal({
      title: '黑卡 SVIP 续期特惠',
      content: '您的黑卡 SVIP 属于永久尊享有效状态，无需续费即可终身享有全部高级权益！',
      showCancel: false,
      confirmText: '太棒了',
      confirmColor: '#d97706'
    });
  },

  onToolTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id === 'history') {
      showToast('已加载全部 48 项历史获取记录');
    } else if (id === 'fav') {
      showToast('已同步 126 项我的云端收藏');
    } else if (id === 'ticket') {
      showToast('您有 2 项求资源工单处理中');
    } else if (id === 'redeem') {
      wx.showModal({
        title: '兑换极客特权',
        editable: true,
        placeholderText: '请输入 8 位激活兑换码...',
        confirmText: '立即兑换',
        confirmColor: '#0f5bd8',
        success: (res) => {
          if (res.confirm && res.content) {
            showToast('兑换码验证成功！特权已激活', 'success');
          }
        }
      });
    }
  },

  onDailyTaskTap() {
    showToast('做任务领云豆：今日任务已完成 3/4');
  },

  onDownloadBoxTap() {
    showToast('下载箱中包含 18 个有效网盘直链及密钥');
  },

  onFeedbackProgressTap() {
    wx.showModal({
      title: '工单处理进度',
      content: '【工单 #89302】WindTerm 备用源补充申请已在处理中，预计 20 分钟内完成上架。',
      showCancel: false,
      confirmText: '查看详情',
      confirmColor: '#0f5bd8'
    });
  },

  onPushNoticeTap() {
    showToast('推送提醒已生效，可在微信消息中接收变动');
  },

  onCheckInTap() {
    showToast('今日签到已领 +10 云豆，连续签到 3 天！', 'success');
  },

  onCommunityTap() {
    wx.showModal({
      title: '官方极客交流社群',
      content: '请添加微信管理员：feng-helper 备注「极客入群」，我们将邀请您进入官方 3 群。',
      confirmText: '复制微信号',
      confirmColor: '#0f5bd8',
      success: (res) => {
        if (res.confirm) {
          copyToClipboard('feng-helper', '管理员微信号已复制');
        }
      }
    });
  },

  onDisclaimerTap() {
    wx.showModal({
      title: '免责声明与下架通道',
      content: '本小程序所有资源均收集整理自开源社区与网络公开渠道，仅供个人技术研究学习，商业用途请购买正版。如有侵权，请联系管理员核实后立即下架。',
      showCancel: false,
      confirmText: '我已知晓',
      confirmColor: '#0f5bd8'
    });
  },

  onCustomerServiceTap() {
    showToast('已接入在线人工客服通道');
  },

  onAboutTap() {
    wx.showModal({
      title: '关于枫的藏宝阁',
      content: '枫的藏宝阁 v2.4.0 纯净原生版\n专为极客开发者、设计师打造的纯净绿色资源导航神器。\nCopyright © 2025 枫的藏宝阁 保留所有权利。',
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#0f5bd8'
    });
  }
});
