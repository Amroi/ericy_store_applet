let ajaxTimes = 0; // 同时发送异步代码的次数(设定这个值是因为我们首页同时发了三次请求,总不能三次弹窗把)

export const request = (params) => {
	// 判断请求参数的url中是否带有 /my/ 若有则需要带上请求头token,而且请求头必须先存在于内存中
	let header = { ...params.header };
	if( params.url.includes("/my/") ) {
		header["Authorization"] = wx.getStorageSync("TOKEN");
	}

	ajaxTimes++;
	// 接口请求的开始显示加载中的弹窗
	wx.showLoading({ title: '加载中...', mask: true });

	const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1" 
	return new Promise((resolve,reject) => {
		wx.request({
			header,
			...params,
			url: baseUrl + params.url,
			
			success: (result) => {
				resolve(result.data.message);
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => { // 无论失败与否的执行函数
				ajaxTimes--;
				if(ajaxTimes === 0) {
					wx.hideLoading(); // 关闭正在等待中提示框
				}
			}
		});
	
	})
}