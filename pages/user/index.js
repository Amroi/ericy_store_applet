Page({
	data: {
		userInfo: {},
		collectNums: 0, // 被收藏商品的数量
	},

	onShow: function() {
		const userInfo = wx.getStorageSync("USERINFO");
		const collect = wx.getStorageSync("COLLECT") || [];
		this.setData({ userInfo, collectNums: collect.length });

	},

})