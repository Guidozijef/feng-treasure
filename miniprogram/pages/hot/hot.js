const { showToast, copyToClipboard } = require('../../utils/util.js');

Page({
  data: {
    // 顶部安全区与自定义导航栏高度
    statusBarHeight: 20,
    navBarHeight: 44,
    menuButtonRight: 12,

    // 一级主维度 Tabs
    tabs: [
      { id: 'soar', name: '总榜飙升', hasIcon: true },
      { id: 'week', name: '本周热门' },
      { id: 'new', name: '今日新上' },
      { id: 'rating', name: '评分最高' }
    ],
    activeTab: 'soar',

    // 二级细分类目
    subCategories: [
      { id: 'all', name: '全部类目' },
      { id: 'pc', name: '电脑应用' },
      { id: 'tools', name: '实用工具' },
      { id: 'study', name: '学霸考研' },
      { id: 'dev', name: '开源源码' }
    ],
    activeCategory: 'all',

    // TOP 1 冠领跑卡片
    top1: {
      id: 'picgo',
      rankBadge: 'TOP 1 冠军榜首',
      heat: '98.6w',
      title: 'PicGo 全功能图床神器',
      version: 'v2.4.1',
      tag: '免安装绿色版',
      desc: '集成 GitHub、七牛云、又拍云等 12+ 图床一键智能上传',
      rating: '9.9 分',
      size: '82.4 MB',
      source: 'GitHub Release / 蓝奏高速',
      link: 'https://github.com/Molunerfinn/PicGo/releases',
      code: '8866'
    },

    // TOP 2 & TOP 3 双列
    top2: {
      id: 'typora',
      rankBadge: 'TOP 2',
      heat: '89.2w',
      icon: '/images/hot_typora.svg',
      title: 'Typora 经典版',
      sub: '极简 Markdown',
      desc: '内附极客暗黑主题包',
      tag: '稳定无弹窗',
      source: '百度网盘 / 阿里云盘',
      link: 'https://pan.baidu.com/s/typora-classic',
      code: 'typo'
    },
    top3: {
      id: 'docker',
      rankBadge: 'TOP 3',
      heat: '76.5w',
      icon: '/images/hot_docker.svg',
      title: 'Docker 极速版',
      sub: 'WSL2 镜像调优',
      desc: '内存降低 40% 开箱即用',
      tag: '国内高速源',
      source: 'Quark网盘 / 123云盘',
      link: 'https://pan.quark.cn/s/docker-desktop-fast',
      code: 'dock'
    },

    // 4 - 10 上升最快热度榜单
    rankList: [
      {
        rank: '04',
        id: 'windterm',
        title: 'WindTerm v...',
        fullTitle: 'WindTerm 极客终端',
        tag: '开源免配',
        tagClass: 'tag-blue',
        rating: '4.9',
        heat: '64.2w热度',
        size: '36MB',
        icon: '/images/hot_windterm.svg',
        source: 'GitHub / 蓝奏云',
        link: 'https://github.com/kingToolbox/WindTerm/releases',
        code: 'wind'
      },
      {
        rank: '05',
        id: 'pixpin',
        title: 'PixPin 离线长...',
        fullTitle: 'PixPin 截图/长截图',
        tag: '神器级',
        tagClass: 'tag-amber',
        rating: '4.9',
        heat: '58.1w热度',
        size: '24MB',
        icon: '/images/hot_pixpin.svg',
        source: '百度网盘',
        link: 'https://pan.baidu.com/s/pixpin-standalone',
        code: 'pixp'
      },
      {
        rank: '06',
        id: 'vscode',
        title: 'VS Code 生产...',
        fullTitle: 'VS Code 生产力调优版',
        tag: '开箱即用',
        tagClass: 'tag-green',
        rating: '5.0',
        heat: '52.4w热度',
        size: '185MB',
        icon: '/images/hot_vscode.svg',
        source: '阿里云盘',
        link: 'https://www.alipan.com/s/vscode-geek-setup',
        code: 'code'
      },
      {
        rank: '07',
        id: 'cs408',
        title: '计算机考研 4...',
        fullTitle: '计算机考研 408 知识体系',
        tag: '高清PDF',
        tagClass: 'tag-cyan',
        rating: '4.9',
        heat: '49.8w热度',
        size: '120MB',
        icon: '/images/hot_cs408.svg',
        source: '夸克网盘',
        link: 'https://pan.quark.cn/s/cs408-roadmap-mindmap',
        code: 'cs40'
      },
      {
        rank: '08',
        id: 'bandizip',
        title: 'Bandizip 商...',
        fullTitle: 'Bandizip 商业纯净版',
        tag: '绿色免装',
        tagClass: 'tag-purple',
        rating: '4.8',
        heat: '46.7w热度',
        size: '18MB',
        icon: '/images/hot_bandizip.svg',
        source: '直链下载',
        link: 'https://pan.quark.cn/s/bandizip-clean',
        code: 'zip6'
      }
    ],

    // 资源获取弹窗
    showModal: false,
    selectedResource: null
  },

  onLoad() {
    this.initNavBarLayout();
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
      showToast('全网热度指数已更新', 'success');
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

  setTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    showToast(`已切换至「${tab === 'soar' ? '总榜·飙升' : tab === 'week' ? '本周热门' : tab === 'new' ? '今日新上' : '评分最高'}」`);
  },

  setCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCategory: cat });
  },

  onIndexRuleTap() {
    wx.showModal({
      title: '极客全网热度指数算法',
      content: '基于近 7 日内全网社群下载量（权重 40%）、用户点赞评分（权重 30%）、直链解析成功率（权重 20%）及收藏转存增长速率（权重 10%）综合加权计算，每小时自动准点结算刷新。',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#3B82F6'
    });
  },

  onHallOfFameTap() {
    wx.showModal({
      title: '历史名人堂',
      content: '历史名人堂记录了在风云榜蝉联榜首超过 30 天的史诗级神级神器（如 VS Code、PicGo、PotPlayer 等）。',
      showCancel: false,
      confirmText: '敬请期待',
      confirmColor: '#3B82F6'
    });
  },

  onWishTap() {
    wx.navigateTo({
      url: '/pages/request/request'
    });
  },

  // 点击「获取」均先跳转至详情页
  openResourceModal(e) {
    const id = e.currentTarget.dataset.id || 'picgo';
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  closeModal() {
    this.setData({
      showModal: false,
      selectedResource: null
    });
  },

  copyResourceLink() {
    const res = this.data.selectedResource;
    if (!res) return;
    const copyContent = `${res.title || res.fullTitle}\n网盘链接: ${res.link}\n提取码: ${res.code || '无'}\n来源: 枫的藏宝阁`;
    copyToClipboard(copyContent, '下载直链与提取码已复制');
    this.closeModal();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id || 'picgo'}`
    });
  }
});
