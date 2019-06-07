import Axios from "axios";
import * as jsonpatch from '../patching'


const actions = ({
  GetCurrentUser({commit}) {

    Axios({
      method: 'POST',
      url: `${myConfig.GrapgQlUrl}api/authentication/user`,
      withCredentials: true,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')}
    }).then(resp => {
      commit("setCurrentUser", resp.data.Name)
      commit("setUserData", resp.data)
      console.log(resp.data)
    });

  },


  LogOut({commit}) {
    localStorage.removeItem("ItUniTocken");
    localStorage.removeItem('userName');
    commit("setCurrentUser", "");

  },
  Login({commit}, loginParam) {

    localStorage.removeItem("ItUniTocken");
    localStorage.removeItem('userName');
    commit("setCurrentUser", "");

    return Axios.post(`${myConfig.GrapgQlUrl}api/authentication/login`, {
      login: loginParam.login,
      password: loginParam.password,
      RememberMe: loginParam.rememberMe
    }, {
      withCredentials: true
    }).then(
      response => {
        const token = response.data.access_token;
        const username = response.data.username
        if (token) {
          commit("setCurrentUser", username);
          localStorage.setItem('ItUniTocken', token);
          localStorage.setItem('userName', username);
          return true;
        }

      })
  },


  /** Загрузить данные для компонента */
  LoadDataForComponent({commit}, {datasource, key}) {
    return Axios({
      method: 'POST',
      url: myConfig.GrapgQlUrl + 'api/graphql',
      withCredentials: true,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
      data: {SchemaName: datasource.schema, query: datasource.query}
    }).then(resp => {
      return commit("setAppData", {key, data: resp.data})
      //console.log(resp.data)
    });
  },

  /** Загрузить описание приложения */
  GetAppDescription(context, appId) {
    return Axios({
      method: 'POST',
      url: myConfig.GrapgQlUrl + 'api/graphql',
      withCredentials: true,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
      data: {
        query: "query q($appId : String) {\n  webapps{\n    application(applicationId:$appId)\n  }\n}",
        variables:
          {appId},
        operationName: "q",
        SchemaName: "WEBAPPS"
      }
    }).then(resp => {
      // Ошибка загрузки
      if (!resp.data.data || !resp.data.data.webapps || !resp.data.data.webapps.application) {
        const spacing = '5px';
        const styles = `padding: ${spacing}; background-color: crimson; color: white; font-size: 2em;`;
        console.log(`%cОшибка загрузки приложения "${appId}"`, styles);
        return;
      }
      // Нет приложения
      if (resp.data.data.webapps.application == "null") {
        const spacing = '5px';
        const styles = `padding: ${spacing}; background-color: crimson; color: white; font-size: 2em;`;
        console.log(`%cОтсутствует описание приложения "${appId}"`, styles);
        return;
      }
      var data = JSON.parse(resp.data.data.webapps.application)
      return context.commit("SetAppDescription", data)
    });
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