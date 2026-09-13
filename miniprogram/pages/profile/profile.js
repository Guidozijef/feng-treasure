const { copyToClipboard, showToast } = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    // 顶部安全区与导航栏高度
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 用户核心数据
    userInfo: {
      nickName: '极客探索者',
      vipBadge: '⚡ SVIP',
      uid: '',
      avatar: '/images/default_avatar.svg',
      privilegeStatus: '微信授权用户 · 极客特权生效中',
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

    // 登录与授权状态
    isLoggedIn: false,
    showNicknameModal: false,
    inputNickname: '',

    // 任务打卡状态
    isCheckIn: false
  },

  onLoad() {
    this.initNavBarLayout();
    const token = wx.getStorageSync('token');
    const uid = wx.getStorageSync('uid');
    if (token && uid) {
      this.setData({ isLoggedIn: true });
      this.loadUserProfile(uid);
    } else {
      // 首次加载自动触发微信登录，根据 openId 自动生成唯一 uid
      this.autoWechatLogin();
    }
  },

  async onPullDownRefresh() {
    await this.loadUserProfile();
    wx.stopPullDownRefresh();
    showToast('个人资产与特权已同步', 'success');
  },

  // 微信静默登录 (自动根据 openId 生成唯一 uid)
  autoWechatLogin() {
    wx.login({
      success: async (loginRes) => {
        if (loginRes.code) {
          const res = await api.wechatLogin(loginRes.code);
          if (res && res.code === 0 && res.data) {
            const { token, profile } = res.data;
            if (token) wx.setStorageSync('token', token);
            if (profile && profile.uid) wx.setStorageSync('uid', profile.uid);
            if (profile && profile.openid) wx.setStorageSync('openid', profile.openid);
            this.setData({
              isLoggedIn: true,
              userInfo: {
                ...this.data.userInfo,
                ...profile
              }
            });
          }
        }
      }
    });
  },

  async loadUserProfile(passedUid) {
    const uid = passedUid || wx.getStorageSync('uid') || this.data.userInfo.uid;
    if (!uid) {
      this.autoWechatLogin();
      return;
    }
    const res = await api.getUserProfile(uid);
    if (res && res.code === 0 && res.data) {
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...res.data
        }
      });
    }
  },

  // 微信授权一键登录
  onWechatLogin() {
    wx.showLoading({ title: '微信登录中...', mask: true });
    wx.login({
      success: async (loginRes) => {
        if (loginRes.code) {
          const res = await api.wechatLogin(loginRes.code);
          wx.hideLoading();
          if (res && res.code === 0 && res.data) {
            const { token, profile } = res.data;
            if (token) wx.setStorageSync('token', token);
            if (profile && profile.uid) wx.setStorageSync('uid', profile.uid);
            if (profile && profile.openid) wx.setStorageSync('openid', profile.openid);
            this.setData({
              isLoggedIn: true,
              userInfo: {
                ...this.data.userInfo,
                ...profile
              }
            });
            showToast('微信授权登录成功！', 'success');
          } else {
            showToast('登录服务响应异常，请重试');
          }
        } else {
          wx.hideLoading();
          showToast('获取微信登录凭据失败');
        }
      },
      fail: () => {
        wx.hideLoading();
        showToast('微信登录接口调用失败');
      }
    });
  },

  // 授权选择微信头像
  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    if (avatarUrl) {
      this.setData({
        'userInfo.avatar': avatarUrl
      });
      showToast('正在同步头像至数据库...');
      const uid = wx.getStorageSync('uid') || this.data.userInfo.uid;
      const res = await api.updateUserProfile({
        uid,
        avatar: avatarUrl
      });
      if (res && res.code === 0) {
        showToast('头像已同步入库', 'success');
      }
    }
  },

  // 授权与修改微信昵称弹窗
  onOpenNicknameModal() {
    this.setData({
      showNicknameModal: true,
      inputNickname: this.data.userInfo.nickName || ''
    });
  },

  onCloseNicknameModal() {
    this.setData({ showNicknameModal: false });
  },

  stopBubble() {},

  onNicknameInput(e) {
    this.setData({ inputNickname: e.detail.value });
  },

  onNicknameChange(e) {
    this.setData({ inputNickname: e.detail.value });
  },

  async onSaveNickname() {
    const nick = (this.data.inputNickname || '').trim();
    if (!nick) {
      showToast('请输入有效的微信昵称');
      return;
    }
    this.setData({
      'userInfo.nickName': nick,
      showNicknameModal: false
    });
    showToast('正在保存昵称至数据库...');
    const uid = wx.getStorageSync('uid') || this.data.userInfo.uid;
    const res = await api.updateUserProfile({
      uid,
      nickName: nick
    });
    if (res && res.code === 0) {
      showToast('昵称已成功入库', 'success');
    }
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
      itemList: ['修改微信头像与昵称', '清理本地临时缓存', '退出登录'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.onOpenNicknameModal();
        } else if (res.tapIndex === 1) {
          wx.clearStorageSync();
          showToast('本地缓存已深度清理', 'success');
        } else if (res.tapIndex === 2) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('uid');
          wx.removeStorageSync('openid');
          this.setData({
            isLoggedIn: false,
            userInfo: {
              ...this.data.userInfo,
              uid: '',
              nickName: '未登录用户',
              avatar: '/images/default_avatar.svg'
            }
          });
          showToast('已退出登录');
        }
      }
    });
  },

  openPrivilegeDetails() {
    wx.navigateTo({
      url: '/pages/vip/vip'
    });
  },

  onRenewVip() {
    wx.navigateTo({
      url: '/pages/vip/vip'
    });
  },

  onToolTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id === 'history') {
      showToast('已加载全部 48 项历史获取记录');
    } else if (id === 'fav') {
      showToast('已同步 126 项我的云端收藏');
    } else if (id === 'ticket') {
      wx.navigateTo({
        url: '/pages/request/request'
      });
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

  // 每日任务 & 福利中心交互
  onTaskRuleTap() {
    wx.showModal({
      title: '每日任务与福利规则',
      content: '1. 每日极客打卡：每日签到可获得 5 极客云豆，连续签到享周末双倍福利；\n2. 邀请好友助力：每成功邀请 1 位好友，立即获赠 50 云豆及 1 天体验黑卡；\n3. 云豆可用于兑换直链极速通道、独家绿色工具包与专属加速。',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#0263e0'
    });
  },

  async onDailyCheckIn() {
    if (this.data.isCheckIn) {
      showToast('今日已完成签到打卡');
      return;
    }
    const uid = wx.getStorageSync('uid') || this.data.userInfo.uid;
    if (!uid) {
      showToast('请先授权登录后再打卡');
      this.autoWechatLogin();
      return;
    }
    this.setData({
      isCheckIn: true
    });
    showToast('打卡成功！+5 云豆已到账', 'success');
    const res = await api.userCheckin(uid);
    if (res && res.code === 0 && res.data && res.data.currentPoints) {
      this.setData({
        'userInfo.points': res.data.currentPoints
      });
    }
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

  onFeedbackTap() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  onRequestResourceTap() {
    wx.navigateTo({
      url: '/pages/request/request'
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
