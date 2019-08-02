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

  /**
   * Конструктор
   * @param {} modulesManager менеджер модулей
   * @param {} dependencies Зависимости
   */
  constructor(vue, dependencies) {
    this.__vue = vue

    if (!dependencies) {
      throw Error('Зависимости должны быть переданы!')
    }

    this.__dependencies = dependencies
    if (!this.__dependencies.axios) {
      throw Error('axios должен быть передан через зависимости!')
    }


    if (!this.__vue.prototype.$graphQlCore) {
      throw Error('Плагин GraphQlCore должен быть использован до испоьлзования даннго планина!')
    }


    // Конфигурируем axios
    this.setUpAxios()

  }

  /** Провайдер аутентификации */
  get __provider () {
    return this.__vue.prototype.$graphQlCore
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
      const response = await this.__provider.LogIn(login, password, rememberMe)

      var token = response.access_token
      // сохранение токена
      if (token) {
        currentUser.set(response)
        let userData = await this.__provider.GetCurrentUser()
        response.UserData = userData
        currentUser.set(response)
        return response
      }
      // если токен не пришел
      throw new Error(`Ошибка входа. \r\b ${response}`)
    } catch (res) {
      throw new Error(`Ошибка входа. \r\n ${res}`)
    }
  }
  
  /**
   * Логин по QR коду
   * @param {string} id Логин
   */
  async loginByQr(id) {
    try {
      // Получаем провайдер
      const response = await this.__provider.LoginByQr(id)

      var token = response.access_token
      // сохранение токена

      if (token) {
        currentUser.set(response)
        let userData = await this.__provider.GetCurrentUser()
        response.UserData = userData
        currentUser.set(response)
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
    let userData = await this.__provider.GetCurrentUser()
    user.UserData = userData
    currentUser.set(user)
  }

  /**
   * Выход - разлогиниться на веб сервере
   */
  async logOff() {
    try {
      if (!this.currentUser) {

        await this.__provider.LogOff()
        currentUser.reset()
      }
    } catch (res) {
      throw new Error(`Ошибка при попытке выйти из системы. \r\n ${res}`)
    }
  }


  async applyDelegatedRights(userId) {
    let result = await this.__provider.ApplyDelegatedRights(userId)
    if (!result.data) {
      throw new Error('Ошибка смены делегированных прав!')
    }
    await this.setCurrentUser()
  }

  async setDelegationRights({userId, dateFrom, dateTo}) {
    return await this.__provider.SetDelegationRights({userId, dateFrom, dateTo})

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
}
