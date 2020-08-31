// 小程序里要把路径补全
import { request } from '../../request/index';

Page({
	data: {
		swiperList:[], // 轮播图数组
		catesList:[], // 导航数组 
		floorList:[], // 楼层数组
	},

	onLoad: function(options){
		this.getSwiperList();
		this.getCatesList();
		this.getFloorList()
	},
	
		// 发送异步请求获取轮播图数据
	getSwiperList() {
			request({ url: '/home/swiperdata' })
			.then(res => {
				this.setData({
					swiperList: res.map(item => ({...item, navigator_url: item.navigator_url.replace("main","index")}) )
				})
			})
	},

	// 获取分类导航数据
	getCatesList() {
		request({ url: '/home/catitems' })
		.then(res => {
			this.setData({
				catesList: res
			})
		})
	},

	// 获取楼层数据
	getFloorList() {
		request({ url: '/home/floordata' })
		.then(res => {
			for (let i = 0; i < res.length; i++) {
				res[i].product_list.forEach((item, index) => {
					res[i].product_list[index].navigator_url = item.navigator_url.replace('?', '/index?');
				});
			}
			this.setData({
				floorList: res
			})
		})
	},

});