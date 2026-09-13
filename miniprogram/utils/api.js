// 枫的藏宝阁 API 客户端服务封装
// 本地开发连接本机 Node/Hono 后台，部署后可切换为线上服务器域名

const BASE_URL = 'http://127.0.0.1:3000/api';

/**
 * 统一网络请求包装
 */
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method: method.toUpperCase(),
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      timeout: 5000,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          resolve(res.data);
        } else {
          console.warn(`[API Warning] ${url} HTTP ${res.statusCode}:`, res.data);
          resolve(null);
        }
      },
      fail: (err) => {
        console.warn(`[API Fail] 请求失败 ${url} (将使用页面预设降级):`, err.errMsg);
        resolve(null); // 失败时 resolve null，允许页面平滑降级使用内置兜底数据
      }
    });
  });
}

const api = {
  // 健康探针
  checkHealth() {
    return request('/health');
  },

  // 1. 首页接口
  getHomeOverview() {
    return request('/home/overview');
  },
  getHomeBanners() {
    return request('/home/banners');
  },
  getHomeAnnouncements() {
    return request('/home/announcements');
  },
  getHomeTopPicks() {
    return request('/home/top-picks');
  },
  getHomeRecommendations(tab = 'all') {
    return request(`/home/recommendations?tab=${encodeURIComponent(tab)}`);
  },

  // 2. 分类接口
  getCategories() {
    return request('/categories');
  },
  getQuickTags() {
    return request('/categories/quick-tags');
  },
  getSubScenes(catId) {
    return request(`/categories/${encodeURIComponent(catId)}/sub-scenes`);
  },

  // 3. 资源接口
  getResources(params = {}) {
    const query = Object.keys(params)
      .filter(k => params[k] !== undefined && params[k] !== '')
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    return request(`/resources${query ? '?' + query : ''}`);
  },
  getResourceDetail(id) {
    return request(`/resources/${encodeURIComponent(id)}`);
  },
  toggleResourceFav(id, isFav) {
    return request(`/resources/${encodeURIComponent(id)}/fav`, 'POST', { isFav });
  },
  getResourceDownload(id) {
    return request(`/resources/${encodeURIComponent(id)}/download`);
  },

  // 4. 搜索接口
  searchResources(keyword, sort = 'composite') {
    return request(`/search?keyword=${encodeURIComponent(keyword)}&sort=${encodeURIComponent(sort)}`);
  },
  getHotKeywords() {
    return request('/search/hot-keywords');
  },

  // 5. 榜单接口
  getHotRankings(tab = 'soar', category = 'all') {
    return request(`/hot/rankings?tab=${encodeURIComponent(tab)}&category=${encodeURIComponent(category)}`);
  },

  // 6. 失效反馈接口
  getFeedbackTypes() {
    return request('/feedback/types');
  },
  submitFeedback(data) {
    return request('/feedback/report', 'POST', data);
  },
  getFeedbackHistory() {
    return request('/feedback/history');
  },
  urgeFeedback(title) {
    return request('/feedback/urge', 'POST', { title });
  },

  // 7. 求资源接口
  getRequestConfig() {
    return request('/request/config');
  },
  submitRequest(data) {
    return request('/request/submit', 'POST', data);
  },
  getRequestHistory() {
    return request('/request/history');
  },
  urgeRequest(orderNo) {
    return request('/request/urge', 'POST', { orderNo });
  },

  // 8. VIP 中心接口
  getVipPlans() {
    return request('/vip/plans');
  },
  getVipPrivileges() {
    return request('/vip/privileges');
  },
  getVipFaqs() {
    return request('/vip/faqs');
  },
  createVipOrder(planId, uid) {
    return request('/vip/create-order', 'POST', { planId, uid });
  },

  // 9. 用户资产与认证接口
  wechatLogin(code, extra = {}) {
    let devId = wx.getStorageSync('dev_client_id');
    if (!devId) {
      devId = 'dev_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
      wx.setStorageSync('dev_client_id', devId);
    }
    return request('/user/login', 'POST', {
      code,
      deviceId: devId,
      openid: wx.getStorageSync('openid') || '',
      ...extra
    });
  },
  updateUserProfile(data) {
    return request('/user/profile/update', 'POST', data);
  },
  getUserProfile(uid) {
    return request(`/user/profile${uid ? '?uid=' + encodeURIComponent(uid) : ''}`);
  },
  userCheckin(uid) {
    return request('/user/checkin', 'POST', { uid });
  },
  getUserFavorites() {
    return request('/user/favorites');
  },
  getUserHistory() {
    return request('/user/history');
  },
  redeemCode(code) {
    return request('/user/redeem', 'POST', { code });
  }
};

module.exports = api;
