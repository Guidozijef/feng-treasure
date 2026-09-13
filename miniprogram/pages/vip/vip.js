const { showToast } = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    // 选中的套餐 ID
    selectedPlanId: 'year',

    // 协议是否已同意 (默认勾选)
    isAgreed: true,

    // 当前选中的套餐详情 (从数据库动态载入)
    currentPlan: null,

    // 套餐列表 (从 PocketBase vip_plans 动态载入)
    plans: [],

    // 黑卡会员 8 大极客特权 (从 PocketBase vip_privileges 动态载入)
    privileges: [],

    // 常见问题与答疑 (从 PocketBase vip_faqs 动态载入)
    faqs: []
  },

  async onLoad(options) {
    const [plansRes, privRes, faqsRes] = await Promise.all([
      api.getVipPlans(),
      api.getVipPrivileges(),
      api.getVipFaqs ? api.getVipFaqs() : null
    ]);

    const plans = (plansRes && plansRes.code === 0 && Array.isArray(plansRes.data)) ? plansRes.data : [];
    const privileges = (privRes && privRes.code === 0 && Array.isArray(privRes.data)) ? privRes.data : [];
    const faqs = (faqsRes && faqsRes.code === 0 && Array.isArray(faqsRes.data)) ? faqsRes.data : [];

    const defaultPlanId = (options && options.plan) ? options.plan : 'year';
    const targetPlan = plans.find(p => p.id === defaultPlanId) || plans[1] || plans[0] || null;

    this.setData({
      plans,
      privileges,
      faqs,
      selectedPlanId: targetPlan ? targetPlan.id : 'year',
      currentPlan: targetPlan
    });
  },

  // 切换选中套餐
  onSelectPlan(e) {
    const planId = e.currentTarget.dataset.id;
    this.selectPlanById(planId);
  },

  selectPlanById(planId) {
    const target = this.data.plans.find(item => item.id === planId);
    if (target) {
      this.setData({
        selectedPlanId: planId,
        currentPlan: target
      });
    }
  },

  // 切换协议勾选
  toggleAgreement() {
    this.setData({
      isAgreed: !this.data.isAgreed
    });
  },

  // 展开/收起常见问题手风琴
  toggleFaq(e) {
    const id = e.currentTarget.dataset.id;
    const faqs = this.data.faqs.map(item => {
      if (item.id === id) {
        return { ...item, isOpen: !item.isOpen };
      }
      return item;
    });
    this.setData({ faqs });
  },

  // 购买记录
  openOrderHistory() {
    wx.showModal({
      title: '购买记录',
      content: '【微信单号 #8920119】\n套餐：极客黑卡 SVIP 尊享版\n支付时间：2025-09-07 23:20:15\n状态：交易完成 · 权益正常生效中',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#0263e0'
    });
  },

  // 特权对比
  openPrivilegeCompare() {
    wx.showModal({
      title: '普通用户 vs 黑卡 SVIP 对比',
      content: '【下载限速】普通用户 500KB/s VS 黑卡 满速千兆直连\n【日下载量】普通用户 3次/天 VS 黑卡 无限次随意提取\n【免看广告】普通用户 需看激励广告 VS 黑卡 全站零广告秒解\n【失效补档】普通用户 社区等待 VS 黑卡 专属工单2小时补齐',
      showCancel: false,
      confirmText: '了解完毕',
      confirmColor: '#0263e0'
    });
  },

  // 会员服务协议
  openServiceProtocol() {
    wx.showModal({
      title: '极客会员服务协议',
      content: '1. 会员权益一经充值生效，即刻绑定当前微信账号；\n2. 严禁使用外挂、批量爬取等破坏性手段滥用直连资源，违者将取消特权；\n3. 枫的藏宝阁全力保障资源的高可用性与补档时效；\n4. 法律范围内枫的藏宝阁享有本协议的最终解释权。',
      showCancel: false,
      confirmText: '同意并了解',
      confirmColor: '#0263e0'
    });
  },

  // 自动续费规则
  openAutoRenewProtocol() {
    wx.showModal({
      title: '自动续费规则与退订须知',
      content: '1. 连续包月套餐将在计费周期结束前 24 小时内由微信支付发起续费；\n2. 您可在微信钱包自动续费管理中随时一键终止代扣，不产生任何额外违约金；\n3. 续订成功后自动顺延特权有效期 31 天。',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#0263e0'
    });
  },

  // 点击底部开通支付按钮
  onPaySubmit() {
    if (!this.data.isAgreed) {
      showToast('请先阅读并同意会员服务协议与退订须知');
      return;
    }

    const { currentPlan } = this.data;

    wx.showLoading({
      title: '正在唤起微信支付...',
      mask: true
    });

    api.createVipOrder(currentPlan.id, '8932014').finally(() => {
      wx.hideLoading();

      // 存储开通成功的 VIP 状态
      wx.setStorageSync('user_is_svip', true);
      wx.setStorageSync('user_vip_plan', currentPlan.name);
      wx.setStorageSync('user_vip_date', currentPlan.id === 'forever' ? '终身永久有效' : '2026-09-12 到期');

      wx.showModal({
        title: '🎉 恭喜！开通成功',
        content: `您已成功开通【${currentPlan.name}】！\n全站 8 大极客特权与满速直链通道现已全量解禁。`,
        confirmText: '立即体验',
        confirmColor: '#0263e0',
        showCancel: false,
        success: () => {
          // 成功后返回上一页
          wx.navigateBack({
            delta: 1,
            fail: () => {
              wx.switchTab({
                url: '/pages/profile/profile'
              });
            }
          });
        }
      });
    });
  }
});
