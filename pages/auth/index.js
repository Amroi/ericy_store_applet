import { request } from '../../request/index.js';
import { login } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({
	// 获取用户支付信息
	handleGetUserInfo() {
		wx.setStorageSync("TOKEN", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
		wx.navigateBack({
			delta: 1 // 返回上一层
		});
	}

	/* ==> 获取token值的接口不可用 ==> 所以接口获取成功后的token字符串值直接编辑了上去
	async handleGetUserInfo(e) {
		try {
			// 获取用户token接口所需的参数
			const { encryptedData, rawData, iv, signature } = e.detail;
			// 获取小程序登陆成功后的code(内置login API中可以获取到登录凭证code)
			const { code } = await login();
			const loginParams = { encryptedData, rawData, iv, signature, code }
			// 发送请求获取token
			const { token } = await request({url:'/users/wxlogin',data:loginParams,method:"post"}) 
			
			wx.setStorageSync("TOKEN", "021xRW7i11b5Ev0uiSC7i1SL48i1xRW7Q");
			wx.navigateBack({
				delta: 1 // 返回上一层
			});
		} catch (error) {
			console.log(error);
		}
	}
	*/
})