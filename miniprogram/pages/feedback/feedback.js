const { showToast, copyToClipboard } = require('../../utils/util.js');

Page({
  data: {
    // 待反馈资源对象 (默认第一项)
    currentResource: {
      id: '84092',
      title: 'PicList 图床管理专家 v2.8.2 专业版',
      category: '开发工具',
      icon: '/images/detail_picgo.svg'
    },

    // 选中的失效类型 (单选)
    selectedIssueType: 'netdisk',

    // 失效问题类型列表 (2x3)
    issueTypes: [
      { id: 'netdisk', name: '网盘链接失效 / 被取消' },
      { id: 'pwd', name: '提取码 / 解压密码错误' },
      { id: 'harm', name: '文件被和谐 / 无法访问' },
      { id: 'corrupt', name: '解压包损坏 / 无法解压' },
      { id: 'outdated', name: '版本过旧 / 需更新' },
      { id: 'other', name: '其它异常问题' }
    ],

    // 具体失效渠道 (多选)
    channels: [
      { id: 'quark', name: '夸克网盘', iconType: 'cloud', selected: true },
      { id: 'baidu', name: '百度网盘', iconType: 'cloud', selected: false },
      { id: 'ali', name: '阿里云盘', iconType: 'cloud', selected: false },
      { id: 'lanzou', name: '蓝奏云', iconType: 'cloud', selected: false },
      { id: 'direct', name: '官方高速直链', iconType: 'link', selected: false }
    ],

    // 问题详情补充描述
    detailText: '',

    // 失效报错截图列表 (最多3张)
    screenshotList: [],

    // 微信服务通知提醒开关
    noticeEnabled: true,

    // 今日还可提交次数
    remainSubmitCount: 5,

    // 我的近期反馈进展列表
    recentProgressList: [
      {
        id: 1,
        title: 'Navicat Premium 16.3 数据库客户端',
        statusType: 'success',
        statusText: '已成功补档',
        time: '今天 11:20',
        token: '百度网盘提取码：geek2025 | 夸克直链：https://pan.quark.cn/s/navicat16'
      },
      {
        id: 2,
        title: 'Cursor AI 高级工作流模板',
        statusType: 'pending',
        statusText: '专人寻找校验中',
        time: '昨天 19:40'
      }
    ],

    // ===================================
    // 切换反馈资源 ActionSheet 抽屉弹窗状态
    // ===================================
    isDrawerOpen: false,
    drawerActiveTab: 'recent',
    drawerSearchKeyword: '',
    drawerSelectedResource: {
      id: '84092',
      title: 'PicList 图床管理专家 v2.8.2 专业版',
      category: '开发工具',
      icon: '/images/detail_picgo.svg'
    },

    // 抽屉可选的备选资源全集
    allDrawerResources: [
      {
        id: '84092',
        title: 'PicList 图床管理专家 v2.8.2 专业版',
        category: '开发工具',
        icon: '/images/detail_picgo.svg',
        getTime: '30分钟前获取',
        isFav: true,
        isRecent: true
      },
      {
        id: '91042',
        title: 'Navicat Premium 16.3 数据库客户端',
        category: '数据库脚本',
        icon: '/images/hot_docker.svg',
        getTime: '今天 10:15 获取',
        isFav: true,
        isRecent: true
      },
      {
        id: '76521',
        title: 'Cursor AI 高级工作流提示词模板',
        category: '人工智能',
        icon: '/images/hot_typora.svg',
        getTime: '昨天 18:30 获取',
        isFav: false,
        isRecent: true
      },
      {
        id: '65420',
        title: 'EchoAPI 接口调试轻量级神器',
        category: 'API工具',
        icon: '/images/hot_windterm.svg',
        getTime: '3天前获取',
        isFav: true,
        isRecent: true
      },
      {
        id: '55210',
        title: 'VS Code 极客定制高效插件合集',
        category: '开发辅助',
        icon: '/images/hot_vscode.svg',
        getTime: '5天前获取',
        isFav: true,
        isRecent: true
      },
      {
        id: '33410',
        title: 'Bandizip 纯净专业版无广告',
        category: '系统工具',
        icon: '/images/hot_bandizip.svg',
        getTime: '1周前获取',
        isFav: false,
        isRecent: true
      }
    ],

    // 抽屉当前展示的过滤列表
    filteredDrawerResources: []
  },

  onLoad(options) {
    if (options && options.id && options.title) {
      this.setData({
        currentResource: {
          id: options.id,
          title: decodeURIComponent(options.title),
          category: options.category || '极客资源',
          icon: options.icon || '/images/detail_picgo.svg'
        }
      });
    }

    this.filterDrawerList();
  },

  // 选择失效问题类型 (单选)
  onSelectIssueType(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedIssueType: id
    });
  },

  // 切换具体失效渠道 (多选)
  onToggleChannel(e) {
    const id = e.currentTarget.dataset.id;
    const channels = this.data.channels.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    this.setData({ channels });
  },

  // 输入详情补充描述
  onDetailInput(e) {
    this.setData({
      detailText: e.detail.value
    });
  },

  // 上传截图
  onChooseImage() {
    const remain = 3 - this.data.screenshotList.length;
    if (remain <= 0) return;

    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: remain,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const newPaths = res.tempFiles.map(f => f.tempFilePath);
          this.setData({
            screenshotList: [...this.data.screenshotList, ...newPaths].slice(0, 3)
          });
        }
      });
    } else {
      wx.chooseImage({
        count: remain,
        success: (res) => {
          this.setData({
            screenshotList: [...this.data.screenshotList, ...res.tempFilePaths].slice(0, 3)
          });
        }
      });
    }
  },

  // 删除截图
  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const list = [...this.data.screenshotList];
    list.splice(index, 1);
    this.setData({
      screenshotList: list
    });
  },

  // 预览大图
  onPreviewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current,
      urls: this.data.screenshotList
    });
  },

  // SVIP 极速通道点击
  onVipChannelTap() {
    wx.navigateTo({
      url: '/pages/vip/vip'
    });
  },

  // 微信服务通知开关
  onNoticeSwitchChange(e) {
    const checked = e.detail.value;
    this.setData({
      noticeEnabled: checked
    });
    showToast(checked ? '服务通知提醒已开启' : '已关闭服务通知提醒');
  },

  // 立即提交失效反馈
  onSubmitFeedback() {
    if (this.data.remainSubmitCount <= 0) {
      showToast('今日提交次数已达上限，感谢您的维护！');
      return;
    }

    if (!this.data.selectedIssueType) {
      showToast('请先选择失效问题类型');
      return;
    }

    const hasChannel = this.data.channels.some(c => c.selected);
    if (!hasChannel) {
      showToast('请至少选择一个失效渠道');
      return;
    }

    wx.showLoading({
      title: '正在提交反馈...',
      mask: true
    });

    setTimeout(() => {
      wx.hideLoading();

      const newRecord = {
        id: Date.now(),
        title: this.data.currentResource.title,
        statusType: 'pending',
        statusText: '专人寻找校验中',
        time: '刚刚'
      };

      this.setData({
        remainSubmitCount: this.data.remainSubmitCount - 1,
        recentProgressList: [newRecord, ...this.data.recentProgressList],
        detailText: '',
        screenshotList: []
      });

      wx.showModal({
        title: '反馈已受理 🚀',
        content: `已成功收到您对【${this.data.currentResource.title}】的失效报告！\n技术专人已进入 12 小时极速补档排期，结果将同步在下方。`,
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#0263e0'
      });
    }, 800);
  },

  // 查看新口令
  onViewNewToken(e) {
    const item = e.currentTarget.dataset.item;
    const token = item.token || '百度网盘提取码：geek2025';

    wx.showModal({
      title: '新补档资源口令',
      content: `${item.title}\n\n${token}`,
      confirmText: '复制口令',
      confirmColor: '#0263e0',
      success: (res) => {
        if (res.confirm) {
          copyToClipboard(token, '新口令已复制到剪贴板');
        }
      }
    });
  },

  // 催一下
  onUrgeProgress(e) {
    const item = e.currentTarget.dataset.item;
    showToast(`已为您催办【${item.title}】，技术人员正在优先处理！`, 'success');
  },

  // ============================================
  // 切换反馈资源抽屉弹窗交互 (图 2)
  // ============================================
  openResourceDrawer() {
    this.setData({
      isDrawerOpen: true,
      drawerSelectedResource: { ...this.data.currentResource },
      drawerSearchKeyword: ''
    });
    this.filterDrawerList();
  },

  closeResourceDrawer() {
    this.setData({
      isDrawerOpen: false
    });
  },

  preventDeduce() {
    // 阻止向上传递冒泡
  },

  onDrawerSearchInput(e) {
    this.setData({
      drawerSearchKeyword: e.detail.value
    });
    this.filterDrawerList();
  },

  clearDrawerSearch() {
    this.setData({
      drawerSearchKeyword: ''
    });
    this.filterDrawerList();
  },

  onSwitchDrawerTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      drawerActiveTab: tab
    });
    this.filterDrawerList();
  },

  filterDrawerList() {
    const { drawerActiveTab, drawerSearchKeyword, allDrawerResources } = this.data;
    let list = [...allDrawerResources];

    if (drawerActiveTab === 'fav') {
      list = list.filter(item => item.isFav);
    } else if (drawerActiveTab === 'recent') {
      list = list.filter(item => item.isRecent);
    }

    if (drawerSearchKeyword && drawerSearchKeyword.trim()) {
      const keyword = drawerSearchKeyword.trim().toLowerCase();
      list = list.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.id.includes(keyword) || 
        item.category.includes(keyword)
      );
    }

    this.setData({
      filteredDrawerResources: list
    });
  },

  onSelectDrawerResource(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      drawerSelectedResource: item
    });
  },

  onConfirmResourceChange() {
    this.setData({
      currentResource: { ...this.data.drawerSelectedResource },
      isDrawerOpen: false
    });
    showToast(`已切换待反馈资源为：${this.data.drawerSelectedResource.title}`);
  }
});
