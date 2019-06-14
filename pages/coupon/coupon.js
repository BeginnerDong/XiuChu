import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
	},



	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData(true);
	},


	getMainData() {
		const self = this;
		const postData = {
			thirdapp_id: 2
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data)
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.couponGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	couponAdd(e) {
		const self = this;
		api.buttonCanClick(self);
		console.log(e);
		var id = api.getDataSet(e, 'id');
		const postData = {
			tokenFuncName: 'getProjectToken',
			coupon_id: id,
			pay: {
				score: 0
			},
		};
		console.log('postData', postData)

		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res && res.solely_code == 100000) {
				api.showToast('领取成功！', 'none', 2000)

			} else {
				api.showToast(res.msg, 'none')
			}

		};
		api.couponAdd(postData, callback);
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
