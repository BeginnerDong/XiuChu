
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({


  data: {
    sForm:{
      height:'',
      weight:'',
      bust:'',
      waistline:'',
			arm_length :'',
      shoulder_width:'',
     

    },
    id:'',
		isdefault:1,
    buttonCanClick:true
  },

  onLoad(options) {
    const self=this;
    if(options.id){
      self.data.id = options.id
      self.getMainData(self.data.id); 
    };
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    });
    wx.hideLoading();
    
  },

  getMainData(id){
    const self = this;
    wx.showLoading();
    const postData = {};
    postData.searchItem = {};
    postData.searchItem.id = id;
    postData.tokenFuncName = 'getProjectToken';
    const callback = (res)=>{
      console.log(res);
      self.data.mainData = res;
      self.data.sForm.height = res.info.data[0].height;
      self.data.sForm.weight = res.info.data[0].weight;
      self.data.sForm.bust = res.info.data[0].bust;
      self.data.sForm.waistline = res.info.data[0].waistline;
      self.data.sForm.arm_length = res.info.data[0].arm_length;
			self.data.sForm.shoulder_width = res.info.data[0].shoulder_width;
      self.data.isdefault = res.info.data[0].isdefault;
      console.log('self.data.isdefault',self.data.isdefault)
      self.setData({
        web_isdefault:self.data.isdefault,
        web_mainData:self.data.sForm,
      })
      wx.hideLoading();
    };
    api.sizeGet(postData,callback);
  },


  inputChange(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },




  sizeUpdate(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    postData.searchItem = {};
    postData.searchItem.id = self.data.id;
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    postData.data.isdefault = self.data.isdefault;
    const callback = (data)=>{
			
      if(data){
				api.buttonCanClick(self,true); 
        api.dealRes(data);
      };
      
    };
    api.sizeUpdate(postData,callback);
  },
  

  sizeAdd(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    postData.data.isdefault = self.data.isdefault;
    const callback = (data)=>{
      if(data){
				 api.buttonCanClick(self,true); 
        api.dealRes(data);
      };
      
    };
    api.sizeAdd(postData,callback);
  },
  

  submit(){
    const self = this;
    api.buttonCanClick(self);

    const pass = api.checkComplete(self.data.sForm);
    console.log('self.data.sForm',self.data.sForm)
    if(pass){
     
        if(self.data.id){
          wx.showLoading();     
          self.sizeUpdate();
        }else{
          wx.showLoading();
          self.sizeAdd();
        }
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },300);  
  
    }else{
			 api.buttonCanClick(self,true);
      api.showToast('请补全信息','fail');
     
    };
  },

 



  switch2Change(e){
    const self = this;
    console.log(e)
    if( e.detail.value == true){
      self.data.isdefault = 1
    }else{
      self.data.isdefault = 0
    }
    
  }

})