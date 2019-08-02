
export default class GraphQlCore {

  constructor(config, { axios }) {
    this.__config = config
    this.__axios = axios

    if (!this.__config) {
      throw new Error('Параметры GrapgQl должны быть заданы!')
    }
    if (!this.__config.GrapgQlUrl) {
      throw new Error('Адрес GraphQl сервера должен быть задан!')
    }
    if (!this.__axios) {
      throw new Error('axios должен быть передан как зависимость!')
    }
  }

  /**
   * Выполнить запрос к GraphQl серверу
   * @param {string} schema Имя схемы GraphQl
   * @param {string} query Тело запроса
   * @param {object} variables Переменные запроса
   * @param {string} operationName Код операции, которую необходимо выполнить
   */
  async GrapgQlQuery({schema, query, variables, operationName}) {
    try {
      let response = await this.__axios({
        method: 'POST',
        url: `${ this.__config.GrapgQlUrl }api/graphql`,
        withCredentials: true,
        data: {
          query,
          variables,
          operationName,
          SchemaName: schema
        }
      })
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }


  /**
   * Вход пользователя
   * @param {String} login Логин пользователя
   * @param {String} password Пароль пользователя
   * @param {Bool} rememberMe Признак "Запомнить меня"
   */
  async LogIn(login, password, rememberMe) {
    const response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/login`, {
      login: login,
      password: password,
      RememberMe: rememberMe
    }, {
      withCredentials: true
    })

    return response.data

  }
  // Вход пользователя по QR коду
  async LoginByQr(id) {
    const response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/alternativelogin`, {code: id, type: 2}, {
      withCredentials: true
    })
    return response.data
  }

  /**
   * Получение полной информации о текущем пользователе
   */
  async GetCurrentUser() {
    let response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/user`, undefined, { withCredentials: true})
    return response.data
  }

  /**
   * Разлогиниться
   */
  async LogOff() {
    await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/logout`, undefined, {
      withCredentials: true
    })
  }

  /**
   * Применить права указанного пользователя
   * @param {string} userId ID пользователя, чьи права нужно применить
   */
  async ApplyDelegatedRights(userId) {
    return await  this.__axios({
      method: 'POST',
      url: `${ this.__config.GrapgQlUrl }api/authentication/delegated`,
      withCredentials: true,
      data: userId
    })
  }

  /**
  * Делегировать права указанному пользователю
  * @param {object} param0 пользователь и дата
   */
  async SetDelegationRights({userId, dateFrom, dateTo}) {
    return await  this.__axios({
      method: 'POST',
      url: `${ this.__config.GrapgQlUrl }api/authentication/delegation`,
      withCredentials: true,
      data: {userId, dateFrom, dateTo}
    })
  }


}
