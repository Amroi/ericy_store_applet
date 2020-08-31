
Page({
  data: {
		tabs: [
			{
				id: 0,
				value: '体验问题',
				isActive: true
			},
			{
				id: 1,
				value: '商品 / 商家投诉',
				isActive: false
			},
		],
		chooseImgs: [], // 上传的图片路径数组
		textVal: '', // 文本域输入的值
	},
	
	UpLoadImgs: [], // 上传地址后的图片路径数组(api不支持多个文件同时上传)

	// 顶部标签选择
	handleItemChange(e) {
		const { index } = e.detail;
		const { tabs } = this.data;
		tabs.forEach(( item, idx ) => {
			return item.isActive = idx === index ? true : false; 
		});
		this.setData({ tabs })
	},

	// 点击上传图片按钮
	handleChooseImg() {
		// 调用小程序内置选择图片的api
		wx.chooseImage({
			count: 9, // 最多可以选择的图片张数
			sizeType: ['original','compressed'], // 所选图片的尺寸(原图，压缩)
			sourceType: ['album','camera'], // 选择图片的来源(照相机，相册)
			success: (result)=>{ // result下的tempFilePaths可以拿到图片的路径
				this.setData({
					// 拼接图片数组而不是替换
					chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
				})
			},
		}); 
	},

	// 点击删除图片
	handleRemoveImg(e) {
		const { index } = e.currentTarget.dataset
		let { chooseImgs } = this.data
		wx.showToast({
			title: '删除成功',
			icon: 'success',
			duration: 500,
			mask: false,
		});
		chooseImgs.splice(index,1);
		this.setData({ chooseImgs })
	},
	
	// 文本域的监听事件 
	handleTextInput(e) {
		this.setData({ textVal: e.detail.value})
	},

	// 提交按钮的触发
	hanleFormSubmit() {
		const { textVal, chooseImgs } = this.data;
		if(!textVal.trim()) {
			wx.showToast({
				title: '内容不能为空',
				icon: 'none',
				mask: true,
			});
			return;
		}

		// 上传图片的过程显示loading
		wx.showLoading({
			title: "正在上传中...",
			mask: true,
		});

		// 判断是否有上传图片
		if (chooseImgs.length != 0) {
			/* 上传图片 到专门的服务器(小程序内置api)
			但是api不支持多个文件同时上传 => 遍历数组 挨个上传 */
			chooseImgs.forEach((item, idx) => {
				wx.uploadFile({
					url: 'https://my.zol.com.cn/index.php?c=Ajax_User&a=uploadImg', // 图片要上传到哪里
					filePath: item, // 被上传文件的路径
					name: "myPhoto", // 上传文件的名称(前后通信的约定)
					formData: {}, // 顺带(额外)的文本信息
					success: (result)=>{
						// 上传到图床后获取JSON形式的url图片地址再放到全局下的图片路径数组
						const { url } = JSON.parse(result.data)
						this.UpLoadImgs.push(url);
					
						// 等到所有的图片上传完毕才请求接口(因为我们是遍历每张图片上传的)
						if (idx === chooseImgs.length - 1) {
							// 提交后重置界面并返回上一页面
							this.setData({ textVal: '', chooseImage: [] })
							wx.hideLoading();
							wx.navigateBack({ delta: 1 });
							wx.showToast({ // 没有接口，我用提示代替
								title: '反馈已提交',
								icon: 'success',
								mask: true,
							});
						}
					},
				});
			})
		} else {
			wx.hideLoading();
			this.setData({ textVal: ''})
			wx.showToast({
				title: '内容已反馈',
				icon: 'sucess',
				mask: true,
			});
		}	
	}


})