import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';

/*
	需求1：用户上滑界面 滚动条触底 开始加载下一页数据
	思路： 1. 找到滚动条触底事件(生命周期方法)  
				2. 判断是否还有下一页数据(当前页码(pagenum)是否大于等于总页数)
					注意：接口中无总页数属性 只有总条数。
						可以使用方法：Math.ceil(总条数total / 页容量pagesize) 
						==>Math.ceil()函数返回大于或等于一个给定数字的最小整数
				3. 假如没有下一页数据  弹出到底提示 
				4. 如果还有下一页数据  1). 当前页码 ++ 
					2). 重新发送请求
					(注意：数据请求回来要对goodsList数组进行拼接不是替换渲染)

	需求2：用户下拉刷新页面
	思路： 1. 触发下拉刷新事件(json先配置=>生命周期方法) 
				2. 重置数据数组并重置页码为1(可能用户拉到了最后一页又下拉刷新)
				3. 数据请求完成 需要手动关闭 等待的效果
*/
Page({
	data: {
		tabs: [
			{
				id: 0,
				value: '综合',
				isActive: true
			},
			{
				id: 1,
				value: '销量',
				isActive: false
			},
			{
				id: 2,
				value: '价格',
				isActive: false
			},
		],
		goodsList: []
	},

	totalPages: 1, // 总页数,初设为1,后面拿到接口中total值,会做重新赋值 
	
	// 接口所需参数
	queryParams:{
		query:'', // 关键字
		cid:'', // 	分类id
		pagenum: 1, // 页码
		pagesize: 10 // 页容量
	},

  onLoad: function (options) {
		// console.log(options);  // options为上级路由传递过来的参数，这里我们拿到上级路由传递过来的商品id
		this.queryParams.cid = options.cid || "";
		this.queryParams.query = options.query || ""; // 从主页传递关键字进来(二选一)
		this.getGoodsList();
	},

	// 页面上拉触底事件的处理函数(生命周期方法)
	onReachBottom: function() {
		if(this.queryParams.pagenum >= this.totalPages) { // 没有下一页数据
			wx.showToast({ title: '没有更多了~',duration: 1000 });
		}	else {
			this.queryParams.pagenum++;
			this.getGoodsList();
		}
	},

	// 页面相关事件处理函数--监听用户下拉动作
	onPullDownRefresh: function() {
		this.setData({ goodsList:[] }) // 重置数组
		this.queryParams.pagenum = 1 // 重置页码
		this.getGoodsList() // 发送请求
		wx.stopPullDownRefresh(); // 关闭下拉刷新的窗口
	},

	// 获取商品列表数据
	async getGoodsList() {
		const res = await request({ url:'/goods/search', data:this.queryParams })
		// 根据接口总条数并计算总页数
		this.totalPages = Math.ceil(res.total / this.queryParams.pagesize);

		this.setData({ goodsList: [...this.data.goodsList ,...res.goods] })
	},
	
	// 顶端标题点击事件
	handleItemChange(e) {
		const { index } = e.detail;
		const tabs = JSON.parse(JSON.stringify(this.data.tabs))

		tabs.forEach((item,idx) => {
			return item.isActive = idx === index ? true : false
		});
		this.setData({ tabs })
	}

})