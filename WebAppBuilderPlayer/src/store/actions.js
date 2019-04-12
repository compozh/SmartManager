import Axios from "axios";
import * as jsonpatch from '../patching'

const actions = ({
 
  GetCurrentUser(context){
    Axios({
      method: 'POST',
      url: 'http://localhost:5000/api/authentication/user',
      withCredentials:true,
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')}
    }).then(resp => {
      context.commit("setCurrentUser", resp.data )
      //console.log(resp.data)
    });
  },


  LogOut(context){
    localStorage.removeItem("ItUniTocken");
    localStorage.removeItem('userName');
    context.commit("setCurrentUser", "");

  },
  Login(context, loginParam) {

    localStorage.removeItem("ItUniTocken");
    localStorage.removeItem('userName');
    context.commit("setCurrentUser", "");

    return Axios.post('http://localhost:5000/api/authentication/login', {
        Login: loginParam.login,
        Password: loginParam.password,
        RememberMe: loginParam.rememberMe
      },{
        withCredentials:true
      }).then(
        // всё Ок
      (response) => {
        debugger
        var token = response.data.access_token;
        var username = response.data.username
        if (token) {
          context.commit("setCurrentUser",  username );
          localStorage.setItem('ItUniTocken', token);
          localStorage.setItem('userName', username);
          return true;
        }
        
      })
  },


  /** Загрузить данные для компонента */
  LoadDataForComponent(context, {datasource,key}){
    Axios({
      method: 'POST',
      url: 'http://localhost:5002/api/graphql',
      withCredentials:true,
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
      data: { SchemaName:datasource.schema, query: datasource.query}
    }).then(resp => {
      context.commit("setAppData", { key, data:resp.data })
      //console.log(resp.data)
    });
  },

  /** Загрузить описание приложения */
  GetAppDescription(context, appId) {
    return Axios.post('http://localhost:5000/api/webapp/get', {
      ApplicationId: appId
    }, {
      withCredentials: true
    }).then(response => {
      if (response.status == 200) {
        return context.commit("SetAppDescription", response.data)
      }
      return new Promise();
    })
  },

  // CallAction(context, data) {
  //   return Axios.post('http://localhost:5000/api/Core/CallAction', {
  //     source: data.source,
  //     event: data.event,
  //     arguments: data.arguments
  //   }).then((response => {
  //     console.log(response.data)

  //   }))
  // }
});
export default actions