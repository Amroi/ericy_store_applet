import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
		goodsObj: {},
		isCollect: false, // 商品是否被收藏
		toolNum: 0,
	},
	// 商品对象(接口中的所有数据,data里的goodsObj为筛选后的)
	goodsInfo:{},

  onShow: function () {
		// onShow生命周期中获取options
		const curPages =  getCurrentPages();
		const { goods_id } = curPages[curPages.length - 1].options;
	
		this.getGoodsDetail(goods_id);
		this.getToolNum();
	},

	// 购物车图标上的数量
	getToolNum() {
		const cart = wx.getStorageSync("CART") || [];
		let toolNum = 0;
		cart.forEach(item => toolNum += item.num)
		this.setData({ toolNum })
	},

	// 一键购买
	handleBuy() {
		wx.showModal({
			title: '此功能待完善...',
			content: '可将商品加入购物车后到购物车中进行结算',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#3CC51F',
		});
	},
	
	// 获取商品详情数据
	async getGoodsDetail(goods_id) {
		const res = await request({ url:'/goods/detail', data:{ goods_id } })
		this.goodsInfo = res;

		// 1. 获取缓存中商品收藏的数组                                                                                                                                                                                                                                                                                
		const collect = wx.getStorageSync("COLLECT") || [];
		// 2. 判断当前的商品是否被收藏了(一开始是false点击收藏后collect空数组传入goodsInfo数组)
		const isCollect = collect.some(item => item.goods_id === this.goodsInfo.goods_id)
		
		// this.setData({ goodsObj }) // 小程序中建议data里只存放标签中要使用的数据
		this.setData({ 
			goodsObj: {
				goods_name: res.goods_name,
				goods_price: res.goods_price,
				/* 
				接口数据中某些图片格式为webp格式而在iPhone等部分手机不支持显示
				最好的解决方式是要求后台更换,前台临时更改处理：正则替换 
				*/
				goods_introduce: res.goods_introduce.replace(/\.webp/g,'.jpg'),
				pics: res.pics,
			}, 
			isCollect
		})

	},

	// 点击轮播图放大预览
	handlePrevewImage(e) {
		// 小程序内置API,
		const imageUrls = this.goodsInfo.pics.map(item => item.pics_mid)
		const currentUrl = e.currentTarget.dataset.url
		wx.previewImage({
			current: currentUrl, // 当前(第一张)要预览的
			urls: imageUrls, // 需要预览的图片链接列表数组
		});
	},

	// 点击加入购物车按钮
	handleCartAdd() {
		// 1. 获取缓存中的购物车数组
		let cart = wx.getStorageSync("CART") || [];
		
		// 2. 判断加入购物车的商品对象是否已存在购物车数组中
		let index = cart.findIndex(item => item.goods_id === this.goodsInfo.goods_id);
		if(index === -1) { // 不存在,为第一次加入购物车 findIndex(用于数组)类似于indexOf(用于字符串)
			this.goodsInfo.num = 1;
			this.goodsInfo.checked = true; // 购物车中勾选
			cart.push( this.goodsInfo )
		} else { // 已经存在当前商品加 1
			cart[index].num++;
		}

		// 3. 把上述情况执行后的购物车数组放到缓冲中
		wx.setStorageSync("CART", cart);
		// 4. 弹窗提示
		wx.showToast({ title: '加入成功~', mask: true });
		this.getToolNum(); // 购物车图标上数量增加
	},

	// 点击商品收藏图标
	handleCollect() {
		let isCollect = false;
		let collect = wx.getStorageSync("COLLECT") || [];
		const index = collect.findIndex(item => item.goods_id === this.goodsInfo.goods_id)
		if(index === -1) { // 证明商品未被收藏过
			collect.push(this.goodsInfo);
			isCollect = true;
			wx.showToast({
				title: '已收藏~',
				icon: 'success',
				mask: true,
			});
		} else { // 已经被收藏过，在数组中删除
			collect.splice(index,1);
			isCollect = false;
			wx.showToast({
				title: '已取消~',
				icon: 'success',
				mask: true,
			});
		}
		// 存入内存中 
		wx.setStorageSync("COLLECT",collect);
		this.setData({ isCollect }) // 修改状态
	}

})