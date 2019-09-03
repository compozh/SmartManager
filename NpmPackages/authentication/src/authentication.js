const currentUserKey = 'currentUser'
/** хранение текущего пользователя в localStorage */
const currentUser = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(currentUserKey))
    } catch (error) {
      this.reset()
    }
  },
  set(val) {
    localStorage.setItem(currentUserKey, JSON.stringify(val))
    return val
  },
  reset() {
    localStorage.removeItem(currentUserKey)
  }
}


/**
 * Класс для работы с аутентификацией
 */
export default class Authentication {

  __dependencies
  __tempResponce
  /**
   * Конструктор
   * @param {} modulesManager менеджер модулей
   * @param {} dependencies Зависимости
   */
  constructor(vue, dependencies, options) {

    if (!dependencies) {
      throw Error('Зависимости должны быть переданы!')
    }

    this.__dependencies = dependencies
    if (!this.__dependencies.axios) {
      throw Error('axios должен быть передан через зависимости!')
    }

    this.__config = options

    this.__store = dependencies.store

    // Конфигурируем axios
    this.setUpAxios()
    this.setCurrentUser()
  }

  get __axios() {
    return this.__dependencies.axios
  }

  /**
   * Добавляем в axios стандартный заголовок авторизации
   */
  setUpAxios() {
    this.__axios.interceptors.request.use(
      (config) => {
        // Если нет текущего пользователя - ничего не делаем
        if (!this.currentUser) {
          return config
        }

        // Получаем токен и добавляем его в заголовки
        let token = this.currentUser.access_token
        if (token) {
          config.headers['Authorization'] = `Bearer ${ token }`
        }
        return config
      },

      (error) => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * Логин
   * @param {string} login Логин
   * @param {string} password Пароль
   * @param {bool} rememberMe Запомнить меня
   */
  async logIn(login, password, rememberMe) {

    try {
      // Логинемся
      let response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/login`, {
        login: login,
        password: password,
        RememberMe: rememberMe
      }, {
        withCredentials: true
      })

      response = response.data

      var token = response.access_token

      if (response.tempPasword) {
        if (token) {
          this.__tempResponce = response
        }
        this.__store.dispatch('authentication/setNeedEnterTempPassword', true)
        return response
      }
      // сохранение токена
      if (token) {
        currentUser.set(response)

        await this.setCurrentUser()
        return response
      }
      // если токен не пришел
      throw new Error(`Ошибка входа. \r\b ${response}`)
    } catch (res) {
      throw new Error(`Ошибка входа. \r\n ${res}`)
    }
  }
  /**
   * Подтверждение входа с помощью временного кода
   * @param {string} tempPassword Временный код
   */
  async СonfirmTempPassword(tempPassword) {
    let response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/confirmtemppasword`, {
      TempPassword: tempPassword
    },{
      withCredentials: true
    })

    if (response.data) {
      currentUser.set(this.__tempResponce)
      this.__tempResponce = undefined
      await this.setCurrentUser()
      this.__store.dispatch('authentication/setNeedEnterTempPassword', false)
    }
    return response.data
  }

  /**
   * Получение ссылки на виджет востановления паролей
   */
  async GetRecoveryPasswordUrl() {
    let response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/recoverypasswordurl`, {
      withCredentials: true
    })
    return response.data
  }

  /**
   * Логин по QR коду
   * @param {string} id Логин
   */
  async loginByQr(id) {
    try {

      let response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/alternativelogin`, {code: id, type: 2}, {
        withCredentials: true
      })
      response = response.data
      var token = response.access_token
      // сохранение токена
      
      if (token) {
        currentUser.set(response)
        await this.setCurrentUser()
        return response
      }
      // если токен не пришел
      throw new Error(`Ошибка входа. \r\b ${response}`)
    } catch (res) {
      throw new Error(`Ошибка входа. \r\n ${res}`)
    }

  }

  async setCurrentUser() {
    var user = this.currentUser
    if (!user) {
      return
    }
    let userData = await this.getCurrentUser()

    if (!userData) {
      return
    }
    user.UserData = userData
    currentUser.set(user)
    this.__store.dispatch('authentication/setCurrentUser', user)
  }

  async getCurrentUser() {
    let response = await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/user`, undefined, { withCredentials: true })
      .catch(function(e) {
        if (e.response.status == 401) {
          currentUser.reset()
        }
      })
    if (response) {
      return response.data
    }
  }

  /**
   * Выход - разлогиниться на веб сервере
   */
  async logOff() {
    try {
      if (this.currentUser) {
        currentUser.reset()
        await this.__axios.post(`${this.__config.GrapgQlUrl}api/authentication/logout`, undefined, {
          withCredentials: true
        })
      }
    } catch (res) {
      throw new Error(`Ошибка при попытке выйти из системы. \r\n ${res}`)
    }
  }


  async applyDelegatedRights(userId) {
    let result =  await  this.__axios({
      method: 'POST',
      url: `${ this.__config.GrapgQlUrl }api/authentication/delegated`,
      withCredentials: true,
      data: userId
    })

    if (!result.data) {
      throw new Error('Ошибка смены делегированных прав!')
    }
    await this.setCurrentUser()
  }

  async setDelegationRights({userId, dateFrom, dateTo}) {
    return await  this.__axios({
      method: 'POST',
      url: `${ this.__config.GrapgQlUrl }api/authentication/delegation`,
      withCredentials: true,
      data: {userId, dateFrom, dateTo}
    })
  }

  /**
   * Получить токен для авторизации на веб сервере
   */
  getAuthHeader() {
    if (!this.currentUser) {
      return undefined
    }
    let token = this.currentUser.access_token
    return {'Authorization': `Bearer ${token}`}
  }


  get currentUser() {
    return currentUser.get()
  }

  resetCurentUser() {
    currentUser.reset()
  }
}
