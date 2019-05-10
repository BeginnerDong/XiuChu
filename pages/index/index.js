import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

//index.js
//获取应用实例


Page({
  data: {
    is_show:true
  },
	show(e){
		const self=this;
		self.data.is_show=false;
		/* self.data.is_show=!self.data.is_show; */
		self.setData({
			is_show:self.data.is_show
		})
	},
  //事件处理函数
  bindViewTap: function() {
   
  },
  onLoad: function () {
   
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  }
	})
