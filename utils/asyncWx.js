/**
 * 封装小程序内置api模块：
 * promise形式的 getSetting,chooseAddress,openSetting,showModal,
 * showToast,login,requestPayment
*/
export const getSetting = () => {
	return new Promise((resolve,reject) => {
		wx.getSetting({
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			},
		});
	})
}

export const chooseAddress = () => {
	return new Promise((resolve,reject) => {
		wx.chooseAddress({
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			},
		});
	})
}

export const openSetting = () => {
	return new Promise((resolve,reject) => {
		wx.openSetting({
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			},
		});
	})
}

export const showModal = (content) => {
	return new Promise((resolve,reject) => {
		wx.showModal({
			title: '提示',
			content: content,
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: "#eb4450",
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			},
		});
	})
}

export const showToast = (title) => {
	return new Promise((resolve,reject) => {
		wx.showToast({
			title: title,
			icon: 'none',
			mask: true,
			duration: 1500,
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			},
		});
	})
}

export const login = () => {
	return new Promise((resolve,reject) => {
		wx.login({
			timeout:10000,
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			},
		});
	})
}

export const requestPayment = (pay) => {
	return new Promise((resolve,reject) => {
		wx.requestPayment({
			...pay,
			success: (result)=>{
				resolve(result)
			},
			fail: (err)=>{
				reject(err)
			},
			
		});
	})
}

