const { showToast } = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    // 顶部 Tab: 'submit' (提交求档工单) | 'history' (我的求档记录)
    activeTab: 'submit',

    // 资源名称 (必填)
    resourceName: '',

    // 资源分类 (必填单选)
    selectedCatId: 'pc',
    categories: [
      { id: 'pc', name: '电脑软件', icon: '/images/cat_pc.svg' },
      { id: 'code', name: '开源源码', icon: '/images/cat_dev.svg' },
      { id: 'mobile', name: '移动应用', icon: '/images/icon_cat_mobile.svg' },
      { id: 'study', name: '学习教程', icon: '/images/cat_study.svg' },
      { id: 'design', name: '设计素材', icon: '/images/cat_design.svg' },
      { id: 'more', name: '其它', icon: '/images/icon_cat_more.svg' }
    ],

    // 希望获取的平台/格式 (多选)
    platforms: [
      { id: 'win', name: 'Windows', selected: true },
      { id: 'mac', name: 'macOS', selected: false },
      { id: 'linux', name: 'Linux', selected: false },
      { id: 'android', name: 'Android', selected: false },
      { id: 'source', name: '源码包', selected: false },
      { id: 'direct', name: '网盘直链', selected: false }
    ],

    // 详细描述
    detailDesc: '',

    // 参考截图列表
    screenshots: [],

    // SVIP 极速加速开关
    isSvipSpeedEnabled: false,

    // 今日剩余提交次数
    remainSubmitTimes: 3,

    // 最近工单进度列表 (从 PocketBase resource_requests 动态载入)
    recentTickets: [],

    // 我的全部求档记录 (从 PocketBase resource_requests 动态载入)
    myTickets: []
  },

  async onLoad(options) {
    const isSvip = !!wx.getStorageSync('user_is_svip');
    this.setData({ isSvipSpeedEnabled: isSvip });

    if (options && options.title) {
      this.setData({
        resourceName: decodeURIComponent(options.title)
      });
    }

    const res = await api.getRequestHistory();
    if (res && res.code === 0 && Array.isArray(res.data)) {
      this.setData({
        recentTickets: res.data,
        myTickets: res.data
      });
    }
  },

  // 顶部 Tab 切换
  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 输入资源名称
  onResourceNameInput(e) {
    this.setData({
      resourceName: e.detail.value
    });
  },

  // 选择分类
  onSelectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedCatId: id
    });
  },

  // 切换平台/格式多选
  onTogglePlatform(e) {
    const id = e.currentTarget.dataset.id;
    const platforms = this.data.platforms.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    this.setData({ platforms });
  },

  // 详细描述输入
  onDetailDescInput(e) {
    this.setData({
      detailDesc: e.detail.value
    });
  },

  // 上传截图
  onChooseScreenshot() {
    const remain = 3 - this.data.screenshots.length;
    if (remain <= 0) return;

    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: remain,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const newPaths = res.tempFiles.map(f => f.tempFilePath);
          this.setData({
            screenshots: [...this.data.screenshots, ...newPaths].slice(0, 3)
          });
        }
      });
    } else {
      wx.chooseImage({
        count: remain,
        success: (res) => {
          this.setData({
            screenshots: [...this.data.screenshots, ...res.tempFilePaths].slice(0, 3)
          });
        }
      });
    }
  },

  // 删除截图
  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const list = [...this.data.screenshots];
    list.splice(index, 1);
    this.setData({
      screenshots: list
    });
  },

  // 预览大图
  onPreviewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current,
      urls: this.data.screenshots
    });
  },

  // SVIP 加速开关
  onSvipSpeedChange(e) {
    const isSvip = !!wx.getStorageSync('user_is_svip');
    if (!isSvip) {
      wx.showModal({
        title: 'SVIP 专属特权',
        content: '极速寻档为 SVIP 会员专享特权，开通后享专人 10~30 分钟极速响应。是否前往开通？',
        confirmText: '去开通',
        confirmColor: '#0f5bd8',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/vip/vip' });
          }
        }
      });
      this.setData({ isSvipSpeedEnabled: false });
      return;
    }
    const checked = e.detail.value;
    this.setData({
      isSvipSpeedEnabled: checked
    });
    showToast(checked ? '已开启 SVIP 10~30分钟极速寻档' : '已恢复标准 24 小时排期寻档');
  },

  // 提交求档需求
  onSubmitDemand() {
    if (this.data.remainSubmitTimes <= 0) {
      showToast('今日求档次数已用完，请明日再来');
      return;
    }

    const { resourceName, selectedCatId, categories, platforms, isSvipSpeedEnabled } = this.data;

    if (!resourceName || !resourceName.trim()) {
      showToast('请输入希望获取的资源名称');
      return;
    }

    const currentCat = categories.find(c => c.id === selectedCatId);
    const selectedPlats = platforms.filter(p => p.selected).map(p => p.name).join(', ') || '通用';

    wx.showLoading({
      title: '正在登记工单...',
      mask: true
    });

    api.submitRequest({
      resourceName: resourceName.trim(),
      category: currentCat ? currentCat.name : '电脑软件',
      platforms: selectedPlats,
      detailDesc: this.data.detailDesc,
      screenshots: this.data.screenshots,
      isSvipSpeedEnabled
    }).then(res => {
      wx.hideLoading();

      const newOrderNo = (res && res.data && res.data.orderNo) ? res.data.orderNo : ('2025' + Math.floor(100000 + Math.random() * 900000));
      const newTicket = {
        id: (res && res.data && res.data.id) || Date.now(),
        orderNo: newOrderNo,
        time: '刚刚',
        status: 'pending',
        statusClass: 'status-pending',
        statusIcon: '↻',
        statusText: isSvipSpeedEnabled ? 'SVIP极速寻档中' : '全网寻档中 · 专人处理',
        title: resourceName.trim(),
        subDesc: isSvipSpeedEnabled ? '专人特派通道加速中，预计30分钟内完成' : '极客巡检工程师已接单，正在全网检索资源',
        category: currentCat ? currentCat.name : '电脑软件',
        platforms: selectedPlats,
        targetResId: null
      };

      this.setData({
        remainSubmitTimes: this.data.remainSubmitTimes - 1,
        resourceName: '',
        detailDesc: '',
        screenshots: [],
        recentTickets: [newTicket, ...this.data.recentTickets],
        myTickets: [newTicket, ...this.data.myTickets]
      });

      wx.showModal({
        title: '工单建立成功 🎯',
        content: `【工单号 #${newOrderNo}】\n技术团队已受理您对「${newTicket.title}」的求档需求，寻档完成后将立即上架并推送通知！`,
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#0263e0'
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },

  // 点击工单“去获取”跳转到详情页
  onGoToResourceDetail(e) {
    const id = e.currentTarget.dataset.id || 1;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 催促进度
  onUrgeTicket(e) {
    showToast('已向接单工程师发送加急催促指令！', 'success');
  },

  // 查看全部工单
  onViewAllTickets() {
    this.setData({
      activeTab: 'history'
    });
  }
});
