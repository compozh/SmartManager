// https://vuex.vuejs.org/en/actions.html
import Axios from "axios";
import myJson from "../../AppSettings.json"
import moment from 'moment'
import { stat } from "fs";
import getters from "./getters.js";
// import myJson from "../../public/AppSettings.json"
//Действия
const actions = ({
  ClearAllState(context){
    context.commit('setInformationFromServer', "");
    context.commit('setCardIsShow', 1);
  },
  WhoCardShowNow(context,cardNum){
    context.commit('setCardIsShow', cardNum);
  },
  ShowDatePicker(context, state){
    context.commit('setShowDateP', state);
  },
  ErrorToday(context,state){
    context.commit('setErrorToday', state);
  },
  IsLogin(context,state){
    context.commit('setLoginStatus', state);
  },
  CloseIframe(context){
    context.commit('setShowiframe', false);
  },
  SetCurentDate(context,state){
    context.commit('setCurentDate', stat);
  },
  SetUserName(context,name){
    context.commit('setUserName', name);
  },

  StartPreloader(context,load,blocked){
    context.commit('setPreLoading', load);
    context.commit('setBlockedWindow',load)
    context.commit('setIsDetail', blocked);
  },
  GetDetailsInformationForTable(context, args){
    //детальная инфа
    context.dispatch('StartPreloader',true,false)
    var table= args.criterion;
    return Axios.post('https://localhost:5001/api/values/GetDetailInformation?criterion='+args.criterion+'&date='+args.date +'&parameters='+args.parameters,undefined, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')},withCredentials: true})
    .then((response) =>{
      switch (table) {
        case 'TopErrorsForDate':
          context.commit('setDetailsErrorsTable', response.data);
          break;
        case 'LongSqlQueries':
          context.commit('setDetailsSQLLongTable', response.data);
          break;
        case "PerfExceedances":
          context.commit('setDetailPerfExec', response.data);
          break;
        case "WebEscalations":
          context.commit('setDetailWebRequestExec', response.data);
          break;
        case "SchedFails":
          context.commit('setDetailSchedulerFails', response.data);
          context.commit('setShowiframe', true);
          break;
        default:
          break;
      }
      context.dispatch('StartPreloader',false,false)
    })
  },
  Login(context,loginParam){
    //логин
    context.dispatch('StartPreloader',true,true)
    var postdata = {
      login:loginParam.login,
      password: loginParam.password,
      rememberMe: loginParam.rememberMe
  };
  
  // appstorage or applicationstorage
  localStorage.clear();
  return Axios.post('https://localhost:5001/api/values/Login',{Login: postdata.login, Password: postdata.password, RememberMe: postdata.rememberMe}, {withCredentials:true})
    .then((response) => {
      var token=JSON.parse(response.data.message);
      var username=response.data.user
      if (token.access_token) {
        localStorage.setItem('authToken', token.access_token);
        localStorage.setItem('userName', username);
        context.commit('setUserName', username);
        if(localStorage.getItem('authToken')){
          context.dispatch('getInfoFromServer');
        }
      }
    }),error=>{
      context.dispatch('StartPreloader',false,false)
  };
  },
  getInfoFromServer(context, calendarDate){
    //общая инфа
   
    var postdata = {
      calcId: 'GET_PROJECT_HEALTH_SUMMARY ',
      args: null,
      ticket: localStorage.getItem('authToken')
  };
  var headers = {
    'Content-Type': 'application/json',
    'Data-Type': 'json'
  };
  var date = ''
    if(localStorage.getItem('authToken')){
      if(calendarDate){
            date = moment(calendarDate).format("DD.MM.YYYY")
        context.dispatch('StartPreloader',true,true)
      }else{
        date=context.getters.getCurentDate
      }
    }
    return Axios.post('https://localhost:5001/api/values/GetInfoAboutServer?date='+date, undefined, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')},withCredentials: true})
    .then((response=>{
      console.log(response.data)
      if(response.data != 'WRONG_TICKET' && response.data !=""){
        context.commit('setLoginStatus',true)
        setTimeout(function(){
          context.commit('setInformationFromServer',response.data);
          //вызываю первую строку по планировщику
          if(response.data.SchedulerFails){
            var detailSchedulerFails={
              criterion:"SchedFails",
              date:"null",
              parameters:response.data.SchedulerFails[0].TaskCode,
            }
            context.dispatch('GetDetailsInformationForTable',detailSchedulerFails);
            detailSchedulerFails.criterion="WebEscalations",
            detailSchedulerFails.date=date,
            detailSchedulerFails.parameters="null",
            context.dispatch('GetDetailsInformationForTable',detailSchedulerFails);
          }
        },10)
        
      }else{
        localStorage.clear();
        context.commit('setLoginStatus',false)
      }
      context.dispatch('StartPreloader',false,false)
      

    }),error=>{
      if(error.response.status==401)
      {
        context.commit('setLoginStatus',false)
        context.dispatch('ClearAllState');
        localStorage.clear();
      }
  })
  }
});
export default actions
