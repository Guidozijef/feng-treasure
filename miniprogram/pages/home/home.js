const { showToast, copyToClipboard } = require('../../utils/util.js');

Page({
  data: {
    // 顶部安全区与导航栏高度
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 搜索关键词
    searchKeyword: '',
    searchPlaceholder: '大家都在搜：Notion中文增强包、考研西综...',

    // Banner 轮播数据
    bannerCurrent: 0,
    bannerList: [
      {
        id: 'ai-tools',
        tag: '2025 重点企划 · 精选首发',
        title: 'AI生产力工具全集',
        subTitle: '50+离线模型与一键开箱脚本整合包',
        btnText: '立即获取'
      },
      {
        id: 'dev-pack',
        tag: '独家定制 · 程序员必备',
        title: '全栈开发效能武器库',
        subTitle: 'Docker镜像加速/高频脚本/逆向工具',
        btnText: '立即获取'
      },
      {
        id: 'design-pack',
        tag: '商用无忧 · 终身免费',
        title: '设计师超级素材全家桶',
        subTitle: '万套精选字体/矢量图标/3D模型',
        btnText: '立即获取'
      }
    ],

    // 金刚区 5 大分类
    categories: [
      { id: 'pc', name: '电脑应用', icon: '/images/cat_pc.svg', bgClass: 'cat-bg-pc' },
      { id: 'study', name: '学习资料', icon: '/images/cat_study.svg', bgClass: 'cat-bg-study' },
      { id: 'tools', name: '效率工具', icon: '/images/cat_tools.svg', bgClass: 'cat-bg-tools' },
      { id: 'design', name: '设计素材', icon: '/images/cat_design.svg', bgClass: 'cat-bg-design' },
      { id: 'dev', name: '编程开发', icon: '/images/cat_dev.svg', bgClass: 'cat-bg-dev' }
    ],

    // 今日更新广播
    noticeText: '今日已更新 38 款优质资源，全部免毒免流...',

    // 热门飙升榜数据
    topPicks: [
      {
        id: 'picgo',
        title: 'PicGo 图床利器 v2.4',
        version: 'v2.4.0',
        badge: 'TOP 1',
        desc: '免安装 · 48MB · 绿色版',
        downloads: '1.2w 人已获取',
        icon: '/images/cloud.svg',
        iconBg: '#e0ecff',
        link: 'https://pan.quark.cn/s/picgo-v240-portable',
        code: 'geek'
      },
      {
        id: 'hbr-mind',
        title: '哈佛商业评论思维...',
        version: '精校典藏版',
        badge: '',
        desc: '精校版 PDF · 320MB',
        downloads: '8.5k 人已获取',
        icon: '/images/book.svg',
        iconBg: '#fef6e7',
        link: 'https://pan.quark.cn/s/hbr-master-collection',
        code: 'hbr8'
      },
      {
        id: 'typora',
        title: 'Typora 经典版 v0.11',
        version: 'v0.11.18',
        badge: 'TOP 3',
        desc: '离线可用 · 62MB · 经典版',
        downloads: '2.3w 人已获取',
        icon: '/images/cat_pc.svg',
        iconBg: '#edf5ff',
        link: 'https://pan.baidu.com/s/typora-classic',
        code: 'type'
      }
    ],

    // 综合精选 Tabs
    tabs: [
      { id: 'all', name: '综合精选' },
      { id: 'new', name: '最新发布' },
      { id: 'essential', name: '装机必备' },
      { id: 'direct', name: '网盘直链' }
    ],
    activeTab: 'all',
    totalCount: '1,240+',

    // 资源列表数据 (完全对应 UI 图中的 5 款精选资源)
    feedList: [
      {
        id: 'trans',
        title: '沉浸式翻译 双语增强插件 v1....',
        tags: [
          { text: 'Edge/Chrome', type: 'blue' },
          { text: '免费直链', type: 'green' }
        ],
        icon: '/images/feed_trans.svg',
        rating: '4.9',
        size: '2.8MB',
        source: '夸克/百度',
        link: 'https://pan.quark.cn/s/immersive-translate-pro',
        code: '7829'
      },
      {
        id: 'fonts',
        title: '2025精选商用免费中文字体...',
        tags: [
          { text: '设计商用', type: 'orange' },
          { text: '100+款', type: 'blue' }
        ],
        icon: '/images/feed_font.svg',
        rating: '4.8',
        size: '1.4GB',
        source: '阿里云盘',
        link: 'https://www.alipan.com/s/commercial-fonts-2025',
        code: 'font'
      },
      {
        id: 'python',
        title: 'Python 实战自动化爬虫项目 ...',
        tags: [
          { text: '源码脚本', type: 'green' },
          { text: '开箱即用', type: 'blue' }
        ],
        icon: '/images/feed_code.svg',
        rating: '5.0',
        size: '420MB',
        source: 'GitHub/网盘',
        link: 'https://pan.quark.cn/s/python-spider-pro',
        code: 'py38'
      },
      {
        id: 'math',
        title: '高数上/下册公式速记手册与...',
        tags: [
          { text: '学霸笔记', type: 'blue' },
          { text: '期末速成', type: 'red' }
        ],
        icon: '/images/feed_chart.svg',
        rating: '4.9',
        size: '86MB',
        source: 'PDF高清版',
        link: 'https://pan.baidu.com/s/math-notes-formula',
        code: 'math'
      },
      {
        id: 'sound',
        title: '影视解说/自媒体转场音效与...',
        tags: [
          { text: '短视频必备', type: 'blue' },
          { text: '无版权', type: 'green' }
        ],
        icon: '/images/feed_audio.svg',
        rating: '4.7',
        size: '2.1GB',
        source: '直链不限速',
        link: 'https://pan.quark.cn/s/video-bgm-effects',
        code: 'bgm9'
      }
    ],

    // 获取资源弹窗交互状态
    showModal: false,
    selectedResource: null
  },

  onLoad() {
    this.initNavBarLayout();
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
      showToast('已同步全网最新资源', 'success');
    }, 600);
  },

  // 计算自定义导航栏尺寸以适配不同机型状态栏与微信胶囊
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

  // 搜索相关交互
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    const kw = this.data.searchKeyword.trim();
    wx.navigateTo({
      url: kw ? `/pages/search/search?keyword=${encodeURIComponent(kw)}` : '/pages/search/search'
    });
  },

  onSearchTap() {
    const kw = this.data.searchKeyword.trim();
    wx.navigateTo({
      url: kw ? `/pages/search/search?keyword=${encodeURIComponent(kw)}` : '/pages/search/search'
    });
  },

  onFilterTap() {
    wx.showActionSheet({
      itemList: ['按下载热度排序', '按最新更新时间', '按网盘类型筛选', '仅看开源免安装'],
      success: (res) => {
        showToast('已为您重新筛选资源排序');
      }
    });
  },

  // Banner 轮播切换联动
  onBannerChange(e) {
    this.setData({
      bannerCurrent: e.detail.current
    });
  },

  // 分类跳转
  goToCategory(e) {
    const type = e.currentTarget.dataset.type;
    wx.switchTab({
      url: '/pages/category/category'
    });
  },

  // 跳转热门页面
  goToHot() {
    wx.switchTab({
      url: '/pages/hot/hot'
    });
  },

  // 跳转详情页
  goToDetail(e) {
    const id = e.currentTarget.dataset.id || 'picgo';
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 今日广播点击
  onNoticeTap() {
    wx.showModal({
      title: '📢 今日资源更新快报',
      content: '今日已收录包括 Docker Desktop 镜像加速版、沉浸式翻译 Pro、2025 商用字体包等 38 款优质生产力工具，均已通过安全无毒检测。',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#1677ff'
    });
  },

  // 综合精选 Tabs 切换
  onTabChange(e) {
    const tabId = e.currentTarget.dataset.id;
    if (tabId === this.data.activeTab) return;
    this.setData({ activeTab: tabId });
    showToast(`已切换至「${e.currentTarget.dataset.name}」`);
  },

  // 点击「获取」按钮均先进入详情页面
  openGetResource(e) {
    const item = e.currentTarget.dataset.item;
    const id = (item && item.id) ? item.id : 'picgo';
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  closeModal() {
    this.setData({
      showModal: false
    });
  },

  // 复制提取码或下载直链
  copyResourceLink() {
    const res = this.data.selectedResource;
    if (!res) return;
    const content = `【枫的藏宝阁】${res.title}\n下载直链：${res.link}\n提取码：${res.code || 'geek'}\n请复制后在浏览器或网盘App打开转存。`;
    copyToClipboard(content, '下载信息已复制');
    this.closeModal();
  }
});
