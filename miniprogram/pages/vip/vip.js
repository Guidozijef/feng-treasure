const { showToast } = require('../../utils/util.js');

Page({
  data: {
    // 选中的套餐 ID
    selectedPlanId: 'year',

    // 协议是否已同意 (默认勾选)
    isAgreed: true,

    // 当前选中的套餐详情
    currentPlan: {
      id: 'year',
      name: '年度黑卡',
      shortName: '极客黑卡',
      price: 68,
      originalPrice: '199',
      discount: 131,
      unit: '/年',
      perDay: '折合 ¥0.18/天',
      extraBenefit: '送600云豆',
      badge: '推荐爆款',
      badgeType: 'badge-orange',
      benefitType: 'benefit-orange'
    },

    // 套餐列表
    plans: [
      {
        id: 'month',
        name: '连续包月',
        shortName: '连续包月',
        price: 9.9,
        originalPrice: '19.9',
        discount: 10,
        unit: '',
        perDay: '折合 ¥0.33/天',
        extraBenefit: '可随时取消',
        badge: '新人首月特惠',
        badgeType: 'badge-blue',
        benefitType: 'benefit-cyan'
      },
      {
        id: 'year',
        name: '年度黑卡',
        shortName: '极客黑卡',
        price: 68,
        originalPrice: '199',
        discount: 131,
        unit: '/年',
        perDay: '折合 ¥0.18/天',
        extraBenefit: '送600云豆',
        badge: '推荐爆款',
        badgeType: 'badge-orange',
        benefitType: 'benefit-orange'
      },
      {
        id: 'forever',
        name: '永久黑卡',
        shortName: '永久黑卡',
        price: 128,
        originalPrice: '399',
        discount: 271,
        unit: '',
        perDay: '一次付费终生',
        extraBenefit: '永久身份徽章',
        badge: '终身买断',
        badgeType: 'badge-black',
        benefitType: 'benefit-gold'
      }
    ],

    // 黑卡会员 8 大极客特权
    privileges: [
      {
        id: 'ad',
        title: '全站免广告',
        desc: '免看激励视频，一键直达高速下载地址',
        icon: '/images/vip_priv_ad.svg',
        bgColor: '#eff6ff'
      },
      {
        id: 'copy',
        title: '无限高速复制',
        desc: '普通用户日限3次，黑卡享受无限次提取',
        icon: '/images/vip_priv_copy.svg',
        bgColor: '#f5f3ff'
      },
      {
        id: 'repo',
        title: '独家私域资源库',
        desc: '商业完整源码、内测神器与极客脚本',
        icon: '/images/vip_priv_repo.svg',
        bgColor: '#fffbeb'
      },
      {
        id: 'repair',
        title: '1对1极速补档',
        desc: '专属工单，链接失效专人在2小时内重传',
        icon: '/images/vip_priv_repair.svg',
        bgColor: '#ecfdf5'
      },
      {
        id: 'pwd',
        title: '解压密码直查',
        desc: '自动匹配解密，全网网盘提取码免解压',
        icon: '/images/vip_priv_pwd.svg',
        bgColor: '#f0f9ff'
      },
      {
        id: 'bean',
        title: '云豆双倍膨胀',
        desc: '签到做任务收益200%，积分兑换加倍快',
        icon: '/images/vip_priv_bean.svg',
        bgColor: '#fff7ed'
      },
      {
        id: 'group',
        title: 'VIP专属交流群',
        desc: '技术大佬闭门交流，群内共享一线开发情报',
        icon: '/images/vip_priv_group.svg',
        bgColor: '#faf5ff'
      },
      {
        id: 'early',
        title: '新资源提前享',
        desc: '全站每日精选新版本提前7天抢先体验',
        icon: '/images/vip_priv_early.svg',
        bgColor: '#fff1f2'
      }
    ],

    // 常见问题与答疑
    faqs: [
      {
        id: 1,
        q: '购买后多久可以开通生效？',
        a: '付款成功后系统将在 1-3 秒内自动为您绑定当前微信 UID 并下发全站黑卡 SVIP 权限，无需手动输入任何激活码，刷新即享全套特权。',
        isOpen: false
      },
      {
        id: 2,
        q: '更换手机或跨平台可以使用吗？',
        a: '特权与您的微信账号永久关联绑定，只要在任意设备（iOS、安卓、PC 微信小程序客户端）登录相同的微信账号，即可无缝同步尊贵身份与直链下载特权。',
        isOpen: false
      },
      {
        id: 3,
        q: '可以开具发票或企业报销吗？',
        a: '支持开具正规增值税电子普通发票（项目：技术咨询服务费 / 信息服务费）。支付完成后可在「购买记录」中填写企业开票抬头和税号，系统将在 24 小时内发送至指定邮箱。',
        isOpen: false
      },
      {
        id: 4,
        q: '连续包月如何取消自动续费？',
        a: '微信支付提供极简快捷的管理方式：在微信客户端【我 - 服务 - 钱包 - 支付设置 - 自动续费】中找到「枫的藏宝阁」，随时一键取消签约，取消后本计费周期内的权益依然有效。',
        isOpen: false
      }
    ]
  },

  onLoad(options) {
    if (options && options.plan) {
      this.selectPlanById(options.plan);
    }
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

    // 模拟安全微信支付流程
    setTimeout(() => {
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
    }, 1200);
  }
});
