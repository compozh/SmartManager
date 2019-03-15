import Axios from "axios";
import * as jsonpatch from '../patching'

const actions = ({
  SetLoginStatus(context, status) {
    context.commit("setLoginStatus", status)
  },
  Login(context, loginParam) {
    //логин
    var postdata = {
      login: loginParam.login,
      password: loginParam.password,
      rememberMe: loginParam.rememberMe
    };
    // appstorage or applicationstorage
    localStorage.clear();
    return Axios.post('https://localhost:5001/api/values/Login', {
        Login: postdata.login,
        Password: postdata.password,
        RememberMe: postdata.rememberMe
      }, {
        withCredentials: true
      })
      .then((response) => {
        var token = JSON.parse(response.data.message);
        var username = response.data.user
        if (token.access_token) {
          localStorage.setItem('authToken', token.access_token);
          localStorage.setItem('userName', username);
          if (localStorage.getItem('authToken')) {
            context.dispatch('GetControls');
            context.dispatch('SetLoginStatus', true);
          }
        }
      })
  },
  GetAppLayout(context,componentName) {
    return Axios.post('http://localhost:5000/api/Core/GetAppLayout?componentName='+ componentName,undefined, {
        // headers: {
        //   'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        // },
        // withCredentials: true
      })
      .then((response => {
        console.log(response.data)
        if (response.data != 'WRONG_TICKET' && response.data != "") {
          context.commit('setAppLayout', response.data)
        } else {
          localStorage.clear();
        }
      }))
  },
  GetAppData(context) {
    return Axios.post('http://localhost:5000/api/Core/GetAppData', undefined, {
        // headers: {
        //   'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        // },
        // withCredentials: true
      })
      .then((response => {
        console.log("data = ",response.data)
        if (response.data != 'WRONG_TICKET' && response.data != "") {
          context.commit('setAppData', response.data)
        } else {
          localStorage.clear();
        }
      }))
  },
  GetApplication(context){
    
  },

  CallAction(context, data) {
    return Axios.post('http://localhost:5000/api/Core/CallAction', {
        source: data.source,
        event: data.event,
        arguments: data.arguments
      }).then((response => {
        console.log(response.data)

      }))
  }
});
export default actions