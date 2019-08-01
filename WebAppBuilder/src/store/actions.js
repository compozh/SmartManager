import Axios from "axios";

const actions = ({
  GetCurrentUser({commit, state}) {

    //
    if(state.applicationDescription.Id && state.applicationDescription.Id.toLowerCase() == "minfin"){
      return;
    }

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

  LoginByQr({commit, dispatch}, id) {
    localStorage.removeItem("ItUniTocken")
    commit("setCurrentUser", null)

    return Axios.post(`${myConfig.GrapgQlUrl}api/authentication/alternativelogin`, {code:id, type:2}, {
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

    // TODO: временно для minfin:
    if(appId.toLowerCase()=="minfin"){
      let minfinApp = {"Id":"MINFIN","Name":"МинФин. Портал","UniqId":"a5623a29-c194-41c6-b1b7-98cb71b7fc8d","RootComponent":{"Name":"minfin-layout","NameInRoute":null,"DataSource":"","DataSourceSchema":"","LinkUniqId":"a5623a29-c194-41c6-b1b7-98cb71b7fc8d","UniqId":"caa78cd0-2961-4ee1-ae0b-a8905a5d152c","Slot":null,"Sort":"0","Properties":[],"SectionProperties":null},"Sections":[{"Id":"","Name":null,"Routes":[{"Id":"MINFINLOGIN","Path":"login","RootComponent":null,"Components":[{"Name":"minfin-login","NameInRoute":"","DataSource":"","DataSourceSchema":"","LinkUniqId":"da93968c-09b5-46bc-88f9-a4d4b32e7fcf","UniqId":"41a1f3a2-451c-467c-a9a0-28cf5c5e625b","Slot":null,"Sort":"","Properties":[],"SectionProperties":null}],"AllowAnonymous":true,"UniqId":"87c53df7-574f-43ab-832e-1f78740ba460","Name":"","Children":[],"Sort":"","Image":"","Badge":"","HideAfterLogin":true},{"Id":"MINFINPROFILE","Path":"","RootComponent":null,"Components":[{"Name":"minfin-profile","NameInRoute":"","DataSource":"","DataSourceSchema":"","LinkUniqId":"e2ef851e-4a88-4d0a-93ff-2aad935358c7","UniqId":"2451a094-23b1-4113-b7e3-d53995ad10f1","Slot":null,"Sort":"","Properties":[],"SectionProperties":null}],"AllowAnonymous":false,"UniqId":"f1988fad-c22c-4ff3-8153-353479b5f429","Name":"","Children":[],"Sort":"","Image":"","Badge":"","HideAfterLogin":false}],"Properties":null}]}

      return commit("SetAppDescription", minfinApp)
    }


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
  async applyDelegatedRights({commit, dispatch}, userId) {
    try {
      const result = await Axios({
        method: 'POST',
        url: myConfig.GrapgQlUrl + 'api/authentication/delegated',
        withCredentials: true,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
        data: userId
      })
      result.data
        ? dispatch('GetCurrentUser')
        : console.log('Не возможно применить делегированные права') // TODO: отобразить отказ в блоке сообщений лейаута
    } catch (error) {
      // TODO: дополнительно отобразить ошибку в блоке сообщений лейаута
      console.log(error.message)
    }
  },
  async setDelegationRights({commit}, {userId, dateFrom, dateTo}) {
    try {
      const result = await Axios({
        method: 'POST',
        url: myConfig.GrapgQlUrl + 'api/authentication/delegation',
        withCredentials: true,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
        data: {userId, dateFrom, dateTo}
      })

      console.log(result)

    } catch (error) {
      console.log(error.message)
    }
  }
})

export default actions