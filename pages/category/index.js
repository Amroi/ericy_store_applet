import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
		leftMenuList: [], // 左侧的菜单导航数据
		rightContent: [], // 右侧的商品展示数据
		currentIndex: 0, // 被选中的索引
		scrollTop: 0, // 右侧内容的滚动条距离顶部的距离 
	},
	catesList: [], // 接口返回的数据

  onLoad: function (options) {
		/*
		优化性能：缓存技术
		1. 首先先判断本地存储中有没有之前存储的数据
		2. 没有代表第一次之直接发送新的请求，有并且数据未过期就是用存储中的数据
		3. 总结web中的本地存储技术和小程序中的区别：
			Ⅰ. 代码不同：
				web中：localStorage.setItem("key","value") / localStorage.getItem("key")
				小程序中：wx.setStorageSync("key",value) / wx.getStorageSync("key")
			Ⅱ. 类型转换处理
				web中：存入的数据必须保证是字符串格式，所以数据必须要先转换为字符串格式
				小程序中：不存在类型转换，存进去的是什么格式的数据，获取的就是什么格式的
		*/ 
		const cates = wx.getStorageSync("CATES");
		if(!cates) { // 不存在存储数据
			this.getCates();
		} else if(Date.now() - cates.time > 1000 * 600) { // 设置过期时间范围并判断是否过期
			this.getCates();
		} else { // 可用存储里的数据
			this.catesList = cates.data;
			const leftMenuList = this.catesList.map(item => item.cat_name)
			const rightContent = this.catesList[0].children
			this.setData({ leftMenuList, rightContent })
		}
	},
	
	// 获取分类数据
	async getCates() {
		const res = await request({ url: '/categories' })
		this.catesList = res;

		// 把接口数据存入到本地存储中
		wx.setStorageSync("CATES", { time:Date.now(),data:this.catesList });

		// 构造左侧的大菜单数据
		const leftMenuList = this.catesList.map(item => item.cat_name)
		// 构造右侧的商品数据
		const rightContent = this.catesList[0].children; // 接口数组里第一个对象的children数组

		this.setData({ leftMenuList, rightContent })
	},

	// 左侧菜单点击事件
	handleItemTap(e) {
		/* 
			1. 获取标签属性data-index中携带的参数并给currentIndex赋值
			2. 显示不同索引下的商品展示
		*/
		const { index } = e.currentTarget.dataset;
		const rightContent = this.catesList[index].children
		this.setData({ 
				currentIndex : index ,
				rightContent,
				scrollTop: 0, // 重新设置右侧内容滚动条距离顶部的距离为0
		})
	}

})