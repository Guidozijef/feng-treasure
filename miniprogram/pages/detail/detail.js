const { copyToClipboard, showToast } = require('../../utils/util.js');

const RESOURCE_MAP = {
  picgo: {
    id: 'picgo',
    title: 'PicGo 图床利器',
    version: 'v2.4.0 稳定绿色版',
    versionBadge: 'v2.4.0',
    desc: '好用的云存储图床管理工具，支持一键上传与剪贴板自动格式转换。免去繁琐安装与广告推送。',
    size: '48.2 MB',
    platform: '全平台免安装',
    rating: '4.9',
    downloads: '1.2w+ 次',
    panUrl: 'https://pan.quark.cn/s/picgo_v240_free',
    pwd: '88ab',
    icon: '/images/detail_picgo.svg'
  },
  typora: {
    id: 'typora',
    title: 'Typora 写作神器',
    version: 'v1.8.10 离线便携版',
    versionBadge: 'v1.8.10',
    desc: '极简无干扰的 Markdown 编辑利器，支持所见即所得、丰富的数学公式排版与暗黑主题自适应。',
    size: '72.4 MB',
    platform: 'Windows / macOS',
    rating: '4.9',
    downloads: '2.8w+ 次',
    panUrl: 'https://pan.quark.cn/s/typora_portable_vip',
    pwd: 'ty66',
    icon: '/images/hot_typora.svg'
  },
  docker: {
    id: 'docker',
    title: 'Docker Desktop 容器引擎',
    version: 'v4.28 镜像加速免装版',
    versionBadge: 'v4.28',
    desc: '专为微服务与本地容器编排调优的高速环境，内置国内多源镜像加速节点，开发更流畅。',
    size: '512 MB',
    platform: 'Windows WSL2 / macOS',
    rating: '4.8',
    downloads: '1.9w+ 次',
    panUrl: 'https://pan.quark.cn/s/docker_desktop_wsl2',
    pwd: 'dock',
    icon: '/images/hot_docker.svg'
  },
  windterm: {
    id: 'windterm',
    title: 'WindTerm 极客终端',
    version: 'v2.6.1 高性能绿色版',
    versionBadge: 'v2.6.1',
    desc: '开源纯 C 语言编写的高性能终端与 SSH 客户端，内存占用极低，支持跳板机与会话自动保存。',
    size: '34.8 MB',
    platform: 'Windows / Linux / macOS',
    rating: '4.8',
    downloads: '9.6k+ 次',
    panUrl: 'https://pan.quark.cn/s/windterm_free_portable',
    pwd: 'term',
    icon: '/images/hot_windterm.svg'
  },
  pixpin: {
    id: 'pixpin',
    title: 'PixPin 截图贴图神器',
    version: 'v1.8.8 离线便携版',
    versionBadge: 'v1.8.8',
    desc: '功能强大的截图、贴图、长截图与离线 OCR 文本识别工具，小巧纯净无弹窗。',
    size: '26.4 MB',
    platform: 'Windows / macOS',
    rating: '4.9',
    downloads: '1.5w+ 次',
    panUrl: 'https://pan.quark.cn/s/pixpin_offline_v188',
    pwd: 'pix8',
    icon: '/images/hot_pixpin.svg'
  },
  vscode: {
    id: 'vscode',
    title: 'VS Code 极客定制版',
    version: 'v1.87 便携免装套件',
    versionBadge: 'v1.87',
    desc: '预装高频开发扩展插件与中文语言包，解压即用，支持随身 U 盘便携运行与配置无缝同步。',
    size: '98.5 MB',
    platform: '全平台免安装',
    rating: '4.9',
    downloads: '3.4w+ 次',
    panUrl: 'https://pan.quark.cn/s/vscode_portable_geek',
    pwd: 'code',
    icon: '/images/hot_vscode.svg'
  },
  bandizip: {
    id: 'bandizip',
    title: 'Bandizip 经典便携版',
    version: 'v6.29 纯净无广告版',
    versionBadge: 'v6.29',
    desc: '终身无广告、支持极速多核压缩解压的经典良心解压软件，支持右键直接智能提取。',
    size: '8.2 MB',
    platform: 'Windows',
    rating: '4.8',
    downloads: '4.2w+ 次',
    panUrl: 'https://pan.quark.cn/s/bandizip_v629_free',
    pwd: 'zip8',
    icon: '/images/hot_bandizip.svg'
  },
  cs408: {
    id: 'cs408',
    title: '计算机 408 考点全集',
    version: '2025 精校高清彩印 PDF',
    versionBadge: '2025版',
    desc: '包含数据结构、计算机组成原理、操作系统与计算机网络四大科目的考点脉络图谱。',
    size: '128 MB',
    platform: 'PDF / 电子书',
    rating: '4.9',
    downloads: '8.8k+ 次',
    panUrl: 'https://pan.quark.cn/s/cs408_core_notes',
    pwd: '408k',
    icon: '/images/hot_cs408.svg'
  }
};

Page({
  data: {
    resource: RESOURCE_MAP.picgo,
    activeTab: 'features',
    showDownloadModal: false,
    isFav: false,
    favCount: '2.4k'
  },

  onLoad(options) {
    const id = (options && options.id) ? options.id.toLowerCase() : 'picgo';
    const target = RESOURCE_MAP[id] || RESOURCE_MAP['picgo'];
    this.setData({
      resource: target
    });
    wx.setNavigationBarTitle({
      title: target.title
    });
  },

  setTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  openDownload() {
    this.setData({ showDownloadModal: true });
  },

  closeDownload() {
    this.setData({ showDownloadModal: false });
  },

  toggleFav() {
    const nextFav = !this.data.isFav;
    this.setData({
      isFav: nextFav,
      favCount: nextFav ? '2.4k+' : '2.4k'
    });
    showToast(nextFav ? '已收藏此资源' : '已取消收藏');
  },

  onPosterTap() {
    showToast('正在生成资源海报...');
  },

  onReportTap() {
    const { resource } = this.data;
    wx.navigateTo({
      url: `/pages/feedback/feedback?id=${resource.id}&title=${encodeURIComponent(resource.title)}&category=${encodeURIComponent(resource.category || '开发工具')}&icon=${encodeURIComponent(resource.icon || '')}`
    });
  },

  goToFeedback() {
    this.setData({ showDownloadModal: false });
    const { resource } = this.data;
    wx.navigateTo({
      url: `/pages/feedback/feedback?id=${resource.id}&title=${encodeURIComponent(resource.title)}&category=${encodeURIComponent(resource.category || '开发工具')}&icon=${encodeURIComponent(resource.icon || '')}`
    });
  },

  copyLink() {
    const { panUrl, pwd, title } = this.data.resource;
    const text = `【枫的藏宝阁】${title} 下载直链：${panUrl} 提取码：${pwd}`;
    copyToClipboard(text, '网盘直链与密码已复制！');
  },

  copyPwd() {
    copyToClipboard(this.data.resource.pwd, '提取码已复制');
  }
});
