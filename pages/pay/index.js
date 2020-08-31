/**
 * 一. 微信的支付功能
 * 1. 企业账号 才可以使用
 * 2. 若企业是多人共同开发小程序，最好是给 开发者 添上白名单
 * 		==>一个appid可以同时绑定多个开发者(微信) 这些开发者就可以公用这个appid和它的开发权限
 * 二. 支付按钮逻辑功能
 * 1. 先判断缓存中有没有token
 * 2. 没有 要跳转到授权页面 进行获取token值
 * 3. 有token就可以创建订单 ==> 获取订单编号
 * 4. 完成微信支付(没有企业账号无法实现)
 * 5. 购物车更新 ==> 删除缓存中选中(代表已支付)的商品
 * 6. 跳转界面
 */

import { requestPayment, showToast } from '../../utils/asyncWx.js'
import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
		adress: {}, // 位置信息(内存中)
		cart: [], // 初始订单信息数据(内存中)
		totalPrice: 0, // 初始总价格
		totalNum: 0, // 初始总数量 
	},

  onShow: function () { 
		const adress = wx.getStorageSync("ADRESS");
		let cart = wx.getStorageSync("CART") || [];
		// 筛选出购物车中选中的商品
		cart = cart.filter(item => item.checked)
	
		let totalPrice = 0,totalNum = 0;
		cart.forEach(item => {
			totalNum += item.num; // 总数量等于所有订单数量总和
			totalPrice += item.num * item.goods_price; // 总价格等于总数量 X 总价格
		});
		
		this.setData({ cart, totalPrice, totalNum, adress });
	},

	// 支付按钮功能(开头有相关的逻辑过程)
	async handleOrderPay() {
		try {
			const token = wx.getStorageSync("TOKEN");
			if(!token) {
				wx.navigateTo({
					url: '/pages/auth/index'
				});
				return false;
			}
			// 创建订单  
			/* 
			// 1. 准备请求头参数(=> 改为在request.js中优化)
			const header = { Authorization : token }; 
			*/
			
			// 2. 准备请求体参数
			const order_price = this.data.totalPrice 
			const consignee_addr = this.data.adress.combination; // 整合后的地址
			let goods = [];
			this.data.cart.forEach(item => goods.push({
				goods_id: item.goods_id,
				goods_number: item.goods_number,
				goods_price: item.goods_price
			}));
			let orderParams = { order_price, consignee_addr, goods } // 解构整合请求参数
			// 3. 发送请求创建订单获取订单编号(在对象属性order_number中)
			const { order_number } = await request({url: '/my/orders/create',data: orderParams, method: 'POST'})
			
			/*
			// 4. 发送请求 预支付接口(获取小程序内置微信支付api所需的参数)
			const { pay } = await request({url: '/my/orders/req_unifiedorder',data: { order_number }, method: 'POST'}) 
			// 5. 发起微信支付(不是企业账号用不了)
			await requestPayment(pay);
			*/
			
			// 6. 查询后台 订单状态
			const res = await request({url: '/my/orders/chkOrder',data: { order_number }, method: 'POST'})
			await showToast('支付成功！');

			// 7. 删除缓存中已经支付了的商品
			let paidCart = wx.getStorageSync("CART");
			paidCart = paidCart.filter(item => !item.checked);
			wx.setStorageSync("CART", paidCart);
			
			// 8. 跳转到订单页面
			wx.redirectTo({
				url: '/pages/order/index?type=1',
			});
		} catch (error) {
			await showToast('支付失败！')
			console.log(error);
		}
	}

})