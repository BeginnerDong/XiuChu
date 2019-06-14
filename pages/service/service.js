import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    artData:[],

    isFirstLoadAllStandard:['getMainData'],
  },
  //事件处理函数
  preventTouchMove:function(e) {

  },

  onLoad(){
    const self = this;
		api.commonInit(self);
    self.getMainData()
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'Label',
        searchItem:{
          title:['=',['售后准则']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
        if(res.info.data.length>0){
          self.data.mainData = res.info.data[0];
					self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
        }   
        api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.articleGet(postData,callback);
  },

})

  