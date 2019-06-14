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
		mainData: [],
		searchItem: {
			type: 2,
			count: ['>', 0]
		},
		isFirstLoadAllStandard: ['getMainData'],
	},


	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getUserData()
	},



	getUserData(){
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res)=>{
		  if(res.solely_code==100000){
		    self.data.userData = res.info.data[0]
		  }else{
		    api.showToast('网络故障','none')
		  }
		  api.checkLoadAll(self.data.isFirstLoadAllStandard,'getUserData',self);
		  self.setData({
					web_userData:self.data.userData,
		  });  
		};
		api.userGet(postData,callback)
	},



	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem)
		postData.order = {
			create_time: 'desc',
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'relation_user',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
			},
			product: {
				tableName: 'Product',
				middleKey: 'relation_id',
				key: 'id',
				searchItem: {
					status: 1
				},
				condition: '=',
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);

			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({

				web_mainData: self.data.mainData,
			});
		};
		api.flowLogGet(postData, callback);
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


})
