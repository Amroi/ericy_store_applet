// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		collect: [],
		tabs: [
			{
				id: 0,
				value: '商品收藏',
				isActive: true
			},
			{
				id: 1,
				value: '店铺收藏',
				isActive: false
			},
			{
				id: 2,
				value: '内容收藏',
				isActive: false
			},
			{
				id: 3,
				value: '浏览足迹',
				isActive: false
			},
		],
	},
	
	onShow: function() {
		const collect = wx.getStorageSync("COLLECT") || [];
		this.setData({ collect })
	},

	// 顶部标签点击
	handleItemChange(e) {
		const { index } = e.detail;
		const tabs = JSON.parse(JSON.stringify(this.data.tabs))

		tabs.forEach((item, idx) => item.isActive = idx === index ? true : false);
		this.setData({ tabs })
	}

})