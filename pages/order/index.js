import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
		tabs: [
			{
				id: 0,
				value: '全部',
				isActive: true
			},
			{
				id: 1,
				value: '待付款',
				isActive: false
			},
			{
				id: 2,
				value: '待发货',
				isActive: false
			},
			{
				id: 3,
				value: '退货/退款',
				isActive: false
			},
		],
		orders: [] // 订单列表
	},

	onLoad() {
		// 查看用户是否有授权信息(即内存中是否有token值)
		const token = wx.getStorageSync("TOKEN");
		if(!token) {
			wx.navigateTo({ url: '/pages/auth/index' });
			return;
		}
	},
	
	/* 
	1. 注意：onShow 不同于 onLoad 无法在形参上接收url上的参数options
	但是顶端标签的选择会变 我们需要在onShow上接收的type 去发送请求
	2. 解决办法：小程序有页面栈的机制(存放为数组，长度最大为10页面)
	我们只要获取数组中 索引最大的页面就是当前页面(类似js的编译机制？后进先出)
	*/
	async onShow() {

		const curPages =  getCurrentPages();
		const { type } = curPages[curPages.length - 1].options;
		// 激活选中的页面标题(当type=1时index=0以此类推)
		this.changeTitleByIndex(type - 1);
		this.getOrders(type)
	},

	// 获取订单列表
	async getOrders(type) {
		 const res = await request({ url: '/my/orders/all', data: { type } })
		 this.setData({ 
			orders: res.orders.map(item => ({...item, create_time_cn: (new Date(item.create_time*1000).toLocaleString()) }) ) 
		}) // 返回原数组并对 原时间格式修改成新的中文时间格式
	},

	// 页面顶端标签点击事件
	handleItemChange(e) {
		const { index } = e.detail; // e中的detail对象存在当前索引值(子组件传递过来的)
		this.changeTitleByIndex(index);
		this.getOrders(index + 1);
	},

	// 顶端标签高亮(index可为：上一级打开哪个页面和当前页标题点击)
	changeTitleByIndex(index) {
		const { tabs } = this.data;
		tabs.forEach((item, idx) => item.isActive = idx === index ? true : false);
		this.setData({ tabs })
	}
})