import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';

/**
 * 搜索框每输入一个字符就发送一个请求
 * 	解决办法：防抖(防止抖动) => 定义全局的定时器id
 * 	1. 防抖 一般在输入框中，防止重复输入 重复发送请求
 * 	2. 节流 一般是用在页面的下拉和上滑
 */
Page({
  data: {
		inpValue: '', // 输入框初始值
		goods: [], // 搜索结果
		isFocus: false, // 取消按钮是否显示(根据输入框是否获得焦点来决定)
	},
	timeId: -1, // 初始定时器

	// 输入框的监听事件
  handleInput(e) {
		// 1. 获取输入框的值
		const { value } = e.detail;
		// 2. 检验合法性(判断是空字符串)
		if(!value.trim()) { // trim() 方法用于删除字符串的头尾空格
			clearTimeout(this.timeId);
			this.setData({ goods: [], isFocus: false })
			return;
		} 

		this.setData({ isFocus: true })
		// 3. 发送请求获取数据(防抖设计) 
		clearTimeout(this.timeId); // 每次输入一个新的字符都先清除上一个定时器
		this.timeId = setTimeout(() => {
			this.reqSearch(value); 
		},1000) // 即不再有新字符之后1s发送请求
		
	},

	// 请求商品搜索接口
	async reqSearch(query) {
		const res = await request({url: '/goods/qsearch',data: {query} });
		this.setData({ goods: res });
	},

	// 取消按钮
	handleCancel() {
		this.setData({
			inpValue: '',
			isFocus: false,
			goods: []
		})
		clearTimeout(this.timeId);
	}


})