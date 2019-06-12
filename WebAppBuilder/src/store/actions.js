import Axios from "axios";

const actions = ({
  GetCurrentUser({commit}) {
    return Axios({
      method: 'POST',
      url: `${myConfig.GrapgQlUrl}api/authentication/user`,
      withCredentials: true,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')}
    }).then(resp => {
      return commit("setCurrentUser", resp.data)
    })
  },
  LogOut({commit}) {
    localStorage.removeItem("ItUniTocken")
    commit("setCurrentUser",null)
  },
  Login({commit, dispatch}, loginParam) {
    localStorage.removeItem("ItUniTocken")
    commit("setCurrentUser", null)

    return Axios.post(`${myConfig.GrapgQlUrl}api/authentication/login`, {
      login: loginParam.login,
      password: loginParam.password,
      RememberMe: loginParam.rememberMe
    }, {
      withCredentials: true
    }).then(
      response => {
        const token = response.data.access_token
        if (token) {
          localStorage.setItem('ItUniTocken', token)
          return dispatch('GetCurrentUser')
            .then(() => true
          )
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
    })
  },
  /** Загрузить описание приложения */
  GetAppDescription({commit}, appId) {
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
        const spacing = '5px'
        const styles = `padding: ${spacing}; background-color: crimson; color: white; font-size: 2em;`
        console.log(`%cОшибка загрузки приложения "${appId}"`, styles)
        return
      }
      // Нет приложения
      if (resp.data.data.webapps.application == "null") {
        const spacing = '5px'
        const styles = `padding: ${spacing}; background-color: crimson; color: white; font-size: 2em;`
        console.log(`%cОтсутствует описание приложения "${appId}"`, styles)
        return
      }
      var data = JSON.parse(resp.data.data.webapps.application)
      return commit("SetAppDescription", data)
    })
  },
})

export default actions