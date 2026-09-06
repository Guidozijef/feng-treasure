// 微信小程序工具函数
function copyToClipboard(data, successMsg = '已复制到剪贴板') {
  wx.setClipboardData({
    data: data,
    success() {
      wx.showToast({
        title: successMsg,
        icon: 'success',
        duration: 2000
      });
    }
  });
}

function showToast(title, icon = 'none') {
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
}

module.exports = {
  copyToClipboard,
  showToast
};
