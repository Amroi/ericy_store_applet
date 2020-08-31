import { getSetting,chooseAddress,openSetting,showModal,showToast } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
		adress: {},
		cart: [], // 初始购物车数据
		allChecked: false, // 初始全选状态
		totalPrice: 0, // 初始总价格
		totalNum: 0, //初始总数量 
	},

  onShow: function () { 
		// 每次来回切换(不要用onLoad仅初次渲染方法)都获取值,有则作页面地址渲染,无则按钮渲染
		const adress = wx.getStorageSync("ADRESS");
		const cart = wx.getStorageSync("CART") || [];
		
		this.setData({ adress })
		this.changeCartStatus(cart);
	},

	// 获取收货地址
	async handleChooseAdress() {
		/* 1. 获取到地址信息前要查看用户是否授权了权限。 
		默认是允许的 就是第一次点击按钮都是可以弹出访问地址界面 
		只有当用户取消了访问权限(拒绝授权) 此后点击按钮就不会弹出界面了 */
		try {
			const res1 = await getSetting();
			const scopeAdress = res1.authSetting["scope.address"]; // 所需的位置权限状态
			
			if(scopeAdress === false) { // 用户拒绝过访问权限=> 引导用户允许授权(弹出授权界面)等待授权结果
				await openSetting();
			}  

			let adress = await chooseAddress(); // 调用小程序自带的获取地址api
			adress.combination = adress.provinceName + adress.cityName + adress.countyName + adress.detailInfo
			wx.setStorageSync("ADRESS", adress); // 存储到内存中
		} catch (error) {
			console.log(error);
		}
	},

	// 单个商品的选中/不选中
	handleItemChange(e) {
		// 1. 获取被修改的商品id
		const goods_id = e.currentTarget.dataset.id;
		// 2. 获取购物车数组(data里的或者内存里的都行)
		let { cart } = this.data;
		// 3. 找到被修改的商品对象并使其选中状态取反(不是变成false)
		const index = cart.findIndex(item => item.goods_id === goods_id);
		cart[index].checked = !cart[index].checked;
		// 4. 触发底部工具栏的改变
		this.changeCartStatus(cart);
	},

	// 工具栏的全选
	handleItemAllChange() {
		let { cart, allChecked } = this.data;
		allChecked = !allChecked // 1. 点击之后触发当前点击状态的反状态
		// 2. 遍历购物车数组 主要是让里面商品的选中状态=> 跟着allChecked的状态同步发生改变
		cart.forEach(item => item.checked = allChecked);
		// 3. 把修改后的值 重新渲染data里的所有状态
		this.changeCartStatus(cart); 
	},

	// 商品数量的编辑(点击)功能
	async handleItemNumEdit(e) {
		/* 与商品的单选按钮逻辑相似
		(获取传递的参数和购物车数组=>找到要修改的商品索引并对其进行操作=>触发底部模块的改变) */
		const { operation, id } = e.currentTarget.dataset;
		let { cart } = this.data;
		
		const index = cart.findIndex(item => item.goods_id === id);
		
		// 优化：数量为1=>0时弹出删除提示框(小程序内置api)并进行删除功能
		if(cart[index].num === 1 && operation === -1) {
			const res = await showModal('是否要删除此商品？');
			if(res.confirm) {
				cart.splice( id,1 );
				this.changeCartStatus(cart);
			}
		} else {
			cart[index].num += operation;
			this.changeCartStatus(cart);
		}
	},

	// 商品的点击结算功能
	async handlePay() {
		// 1. 判断收货地址
		const { adress,totalNum } = this.data;
		if(!adress.userName) {
			await showToast('你还没有选择地址');
			return false;
		} else if(totalNum === 0) { // 根据结算后面的数字判断是否有选购商品
			await showToast('你还没有选购商品')
			return false;
		} else{
			wx.navigateTo({ url: '/pages/pay/index' });
		}
	},

	/* 改变购物车状态(加入商品/取消选择商品)的回调 
	=> 重新计算 底部工具栏的全选/总价格/购买数量(封装这个模块非常有必要,因为与可以很多状态改变绑定) */
	changeCartStatus(cart) {
		// every() 方法用于检测数组所有元素是否都符合指定条件(通过函数提供),对空数组检测会返回true！！！
		// const allChecked = cart.length > 0 ? cart.every(item => item.checked === true) : false;
		
		// 计算总价格和总数,并优化两次(every和forEach)遍历(消耗性能)合并为一次
		let totalPrice = 0,totalNum = 0,allChecked = true;
		cart.forEach(item => {
			if(item.checked) { // item.checked === true省略写,都需要被选中才计算
				totalNum += item.num;
				totalPrice += item.num * item.goods_price;
			} else {
				allChecked = false;
			}
		});
		// 同样要注意forEach() 对于空数组是不会执行回调函数的。不为空数组等于上述执行结果否则为false
		allChecked = cart.length != 0 ? allChecked : false; 
		
		this.setData({ cart, totalPrice, totalNum, allChecked });
		wx.setStorageSync("CART", cart);
	}
})