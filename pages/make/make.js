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
		count: 1,
		isFirstLoadAllStandard: ['getMainData', 'getCouponData'],
		buttonType: 'deliver',
		showCoupon: false,
		couponData: [],
		sizeData:[],
		addressData:[],
		pay: {
			coupon: []
		},
		searchItem: {
			isdefault: 1
		},
		searchItemTwo: {
			isdefault: 1
		},
	},


	//事件处理函数

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData();
		self.getCouponData();
		self.getStoreData();
		self.setData({
			web_buttonType: self.data.buttonType,
			web_showCoupon: self.data.showCoupon,
			web_count: self.data.count
		})
	},

	onShow() {
		const self = this;
		self.data.searchItem = {};
		if (getApp().globalData.address_id) {
			self.data.searchItem.id = getApp().globalData.address_id;
		} else {
			self.data.searchItem.isdefault = 1;
		};
		if (getApp().globalData.size_id) {
			self.data.searchItemTwo.id = getApp().globalData.size_id;
		} else {
			self.data.searchItemTwo.isdefault = 1;
		};
		self.getAddressData();
		self.getSizeData()
	},

	getAddressData() {
		const self = this;
		const postData = {}
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.addressData = res.info.data[0];
			};
			console.log('getAddressData', self.data.addressData)
			self.setData({
				web_addressData: self.data.addressData,
			});
		};
		api.addressGet(postData, callback);
	},

	getSizeData() {
		const self = this;
		const postData = {}
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItemTwo);
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.sizeData = res.info.data[0];
			};

			self.setData({
				web_sizeData: self.data.sizeData,
			});
		};
		api.sizeGet(postData, callback);
	},

	getStoreData() {
		const self = this;
		const postData = {}
		postData.searchItem = {
			title: '门店管理'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.storeData = res.info.data[0];
			};
			console.log('getAddressData', self.data.storeData)
			self.setData({
				web_storeData: self.data.storeData,
			});
		};
		api.labelGet(postData, callback);
	},


	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			id: self.data.id
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
			self.countPrice()
		};
		api.productGet(postData, callback);
	},

	counter(e) {
		const self = this;
		if (api.getDataSet(e, 'type') == '+') {
			self.data.count++;
		} else if (api.getDataSet(e, 'type') == '-' && self.data.count > '1') {
			self.data.count--;
		}
		console.log('self.data.count', self.data.count)
		self.countPrice();
	},

	ifShowCoupon() {
		const self = this;
		self.data.showCoupon = !self.data.showCoupon;
		self.setData({
			web_showCoupon: self.data.showCoupon
		})
	},

	getCouponData() {
		const self = this;
		api.buttonCanClick(self);
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			use_step: 1
		}
		postData.order = {
			create_time: 'desc'
		}
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				if (res.info.data.length > 0) {
					self.data.couponData.push.apply(self.data.couponData, res.info.data);
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none', 1000);
				};

				api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getCouponData', self);
				self.setData({
					web_couponData: self.data.couponData,
				});
			} else {
				api.showToast('网络故障', 'none')
			}
		};
		api.userCouponGet(postData, callback);
	},

	useCoupon(e) {
		const self = this;
		self.data.couponIndex = api.getDataSet(e, 'index');
		console.log(api.getDataSet(e, 'index'))
		var id = self.data.couponData[self.data.couponIndex].id;
		var findCoupon = api.findItemInArray(self.data.couponData, 'id', id);
		var findItem = api.findItemInArray(self.data.pay.coupon, 'id', id);
		console.log('findCoupon', findCoupon)
		if (findCoupon) {
			findCoupon = findCoupon[1];
			var findSameCoupon = api.findItemsInArray(self.data.pay.coupon, 'product_id', id);
		} else {
			api.showToast('优惠券错误', 'error');
			return;
		};
		if (self.data.pay.coupon.length > 0) {
			self.data.pay.coupon = []
		} else {
			if (findCoupon.type == 1) {
				var couponPrice = findCoupon.discount;
				console.log('findCoupon.discount', findCoupon.discount)
			} else if (findCoupon.type == 2) {

				var couponPrice = parseFloat(self.data.price).toFixed(2) - parseFloat(findCoupon.discount / 10 * self.data.price)
					.toFixed(2);
			};
			if (parseFloat(couponPrice) + parseFloat(self.data.couponTotalPrice) > parseFloat(self.data.price)) {
				couponPrice = parseFloat(self.data.price).toFixed(2) - parseFloat(self.data.couponTotalPrice).toFixed(2);
			};
			self.data.pay.coupon.push({
				id: id,
				price: couponPrice,
			});
			self.data.showCoupon = false
		};
		self.countPrice();
	},

	countPrice() {

		const self = this;
		var totalPrice = 0;
		var couponPrice = 0;
		self.data.couponTotalPrice = api.addItemInArray(self.data.pay.coupon, 'price');
		self.data.price = self.data.mainData.price * self.data.count;
		console.log('self.data.price', self.data.price)

		/* if (self.data.sForm.balance > 0) {
			self.data.pay.balance = self.data.sForm.balance
		}; */
		var wxPay = self.data.price - self.data.couponTotalPrice
		if (wxPay > 0) {
			self.data.pay.wxPay = {
				price: wxPay.toFixed(2),
			};
		} else {
			delete self.data.pay.wxPay;
		};
		console.log('countPrice-wxPay', wxPay);
		console.log('countPrice-price', self.data.price);
		console.log('countPrice', self.data.pay);
		self.setData({
			web_couponPrice: parseFloat(self.data.couponTotalPrice).toFixed(2),
			web_price: parseFloat(self.data.price).toFixed(2),
			web_pay: self.data.pay,
			web_count: self.data.count,
			web_couponIndex: self.data.couponIndex,
			web_showCoupon: self.data.showCoupon
		});

	},



	toMap() {
		const self = this;
		wx.getLocation({
			type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			success: function(res) {
				var latitude = parseFloat(self.data.storeData.latitude);
				var longitude = parseFloat(self.data.storeData.longitude);
				wx.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: self.data.storeData.description,
					scale: 28
				})
			}
		})
	},


	selectModel(e) {
		const self = this;
		self.data.buttonType = api.getDataSet(e, 'type');
		console.log(self.data.buttonType)
		self.setData({
			web_buttonType: self.data.buttonType,
		})
	},

	addOrder(e) {
		const self = this;
		if (self.data.buttonType == "deliver") {
			if (self.data.addressData.length == 0) {
				api.buttonCanClick(self, true);
				api.showToast('请选择收货地址', 'none');
				return
			}
		};
		if (self.data.sizeData.length==0) {
			api.buttonCanClick(self, true);
			api.showToast('请补充尺码信息', 'none');
			return
		};
		if (self.data.orderId) {
			self.pay(self.data.orderId);
			return
		};
		const postData = {
			tokenFuncName: 'getProjectToken',

			orderList: [{
				product: [{
					id: self.data.mainData.id,
					count: self.data.count,
				}, ],
				type: 1,
			}],
			data: {},
			snap_size:self.data.sizeData
		};
		if (self.data.buttonType == 'pick') {
			postData.data.passage1 = self.data.storeData.id;
			postData.data.transport_type = 2;
		};
		if (self.data.buttonType == 'deliver') {
			postData.snap_address = self.data.addressData;
			postData.data.transport_type = 1;
		};
		if (!wx.getStorageSync('info') || !wx.getStorageSync('info').headImgUrl) {
			postData.refreshToken = true;
		};
		const callback = (res) => {
			if (res && res.solely_code == 100000) {
				self.data.orderId = res.info.id;
				console.log('self.orderId', self.orderId)
				self.pay(self.data.orderId)
			} else {
				api.showToast(res.msg, 'none')
			};
		};
		api.addOrder(postData, callback);
	},

	pay(order_id) {
		const self = this;
		const postData = self.data.pay;
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.orderId
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				if (res.info) {
					const payCallback = (payData) => {
						if (payData == 1) {
							const cc_callback = () => {
								api.pathTo('/pages/allOder/allOder', 'redi');
							};
							api.showToast('支付成功', 'none', 1000, cc_callback);
						};
					};
					api.realPay(res.info, payCallback);
				} else {
					api.showToast('支付成功', 'none', 1000, function() {
						api.pathTo('/pages/allOder/allOder', 'redi');
					});
				};
			} else {
				api.showToast(res.msg, 'none');
			};
		};
		api.pay(postData, callback);
	},

	submit(e) {
		const self = this;
		api.buttonCanClick(self);
		const callback = (user, res) => {
			self.addOrder();
		};
		api.getAuthSetting(callback);

	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
})
