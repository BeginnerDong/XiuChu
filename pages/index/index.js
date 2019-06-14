import {
	Api
} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();



Page({
	data: {
		indicatorDotsTwo: true,
		indicatorDots: false,
		vertical: true,
		verticalTwo: false,
		autoplay: false,

		circular: true,
		interval: 2000,
		duration: 500,
		previousMargin: 0,
		nextMargin: 0,

		is_show: true,
		mainData: [],
		searchItem: {},
		isFirstLoadAllStandard: ['getMainData','getSliderData'],
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
		self.getSliderData()
	},

	getSliderData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			title: '首页视频'
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.sliderData = res.info.data[0];		
			}	
			self.setData({
				web_sliderData: self.data.sliderData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getSliderData', self);
		};
		api.labelGet(postData, callback);
	},


	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			type: 1,
			thirdapp_id: 2,
		};
		postData.order = {
			listorder: 'desc'
		};
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
					for (var i = 0; i < self.data.mainData.length; i++) {
						self.data.mainData[i].current = 0
					}
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none', 1000);
				};
				console.log(self.data.mainData)
				api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.showToast(res.msg, 'none')
			}
		};
		api.productGet(postData, callback);
	},

	prevImg(e) {
		const self = this;
		console.log(111)
		var index = api.getDataSet(e, 'index');
		self.data.mainData[index].current = self.data.mainData[index].current > 0 ? self.data.mainData[index].current - 1 : self.data.mainData[index].mainImg.length - 1;

		self.setData({
			web_mainData: self.data.mainData
		})
	},

	nextImg(e) {
		const self = this;
		console.log(222)
		var index = api.getDataSet(e, 'index');
		self.data.mainData[index].current = self.data.mainData[index].current < (self.data.mainData[index].mainImg.length - 1) ? self.data.mainData[index].current + 1 : 0;
		console.log(self.data.mainData[index].current)
		self.setData({
			web_mainData: self.data.mainData
		})
	},


show(e) {
	const self = this;
	self.data.is_show = false;
	self.setData({
		is_show: self.data.is_show
	})
},

intoPathRedirect(e) {
	const self = this;
	api.pathTo(api.getDataSet(e, 'path'), 'redi');
},

intoPath(e) {
	const self = this;
	api.pathTo(api.getDataSet(e, 'path'), 'nav');
}

})
