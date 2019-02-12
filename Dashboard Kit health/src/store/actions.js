// https://vuex.vuejs.org/en/actions.html
import Axios from "axios";
import myJson from "../../AppSettings.json"
//Действия
const actions = ({
  ErrorToday(context,state){
    context.commit('setErrorToday', state);
  },
  Login(context,loginParam){
    var postdata = {
      login:loginParam.login,
      password: loginParam.password
  };
  var headers = {
    'Content-Type': 'application/json',
    'Data-Type': 'json'
  };
  var datas;
      return Axios.post(myJson.webServiceUrl + "ws/WebService.asmx/Loginex", postdata,headers)
        .then((response) => {
          datas = response.data.d
          datas = JSON.stringify(datas);
          datas = JSON.parse(datas)
          datas = JSON.parse(datas)
           if (datas.Ticket) {
              context.commit('setTicket', datas.Ticket);
              this.dispatch('getInfoFromServer');
           }
        });
  },
  getInfoFromServer(context){
    var postdata = {
      calcId: 'GET_PROJECT_HEALTH_SUMMARY ',
      args: null,
      ticket: context.getters.getTicket
  };
  var headers = {
    'Content-Type': 'application/json',
    'Data-Type': 'json'
  };
  var datas;
    return Axios.post(myJson.webServiceUrl + "ws/WebService.asmx/ExecuteEx",postdata,headers)
    .then((response=>{
      datas = response.data.d
      datas = JSON.stringify(datas);
      datas = JSON.parse(datas)
      datas = JSON.parse(datas)
        context.commit('setLoginStatus',true)
      setTimeout(function(){
      context.commit('setInformationFromServer',datas);
      },10)
    }))
  }
});
export default actions
