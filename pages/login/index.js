Page({
	// 获取用户信息
	handleGetUserInfo(e) {
		const { userInfo } = e.detail;
		wx.setStorageSync("USERINFO", userInfo);
		wx.navigateBack({ // wx.navigateTo不能跳到 tabbar 页面
			delta: 1
		});
	}
})