console.log("Authentication module loaded!")

const currentUserKey = "currentUser"

/** хранение текущего пользователя в localStorage */
const currentUser = {
  get(){
    try {
      return JSON.parse(localStorage.getItem(currentUserKey))
    } catch (error) {
      this.reset()
    }
  },
  set(val){
    localStorage.setItem(currentUserKey, JSON.stringify(val))
    return val
  },
  reset(){
    localStorage.removeItem(currentUserKey)
  }
}


/**
 * Класс для работы с аутентификацией
 */
export default class Authentication {
  __modulesManager
  __dependencies

  /**
   * Конструктор
   * @param {} modulesManager менеджер модулей
   * @param {} dependencies Зависимости
   */
  constructor(dependencies) {
    if(!dependencies){
      throw Error("Зависимости должны быть переданы!")
    }
    this.__dependencies = dependencies
    if(!this.__dependencies.axios){
      throw Error("axios должен быть передан через зависимости!")
    }

    this.__modulesManager = dependencies.modulesManager

    if(!this.__modulesManager){
      throw Error("Менеджер модулей должен быть внедрен в зависимости!")
    }


    // Конфигурируем axios
    this.setUpAxios()

  }

  /** Провайдер аутентификации */
  __provider (){
    return this.__modulesManager.getGraphQlCore()
  }

  get __axios(){
    return this.__dependencies.axios
  }

  /**
   * Добавляем в axios стандартный заголовок авторизации
   */
  setUpAxios(){
    this.__axios.interceptors.request.use(
      (config) => {
        // Если нет текущего пользователя - ничего не делаем
        if(!this.currentUser){
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

      // Получаем провайдер
      let provider = await this.__provider()

      // Логинемся
      const response = await provider.LogIn(login, password, rememberMe)

      var token = response.access_token
      // сохранение токена
      if (token) {
        currentUser.set(response)
        let userData = await provider.GetCurrentUser()
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
   * Выход - разлогиниться на веб сервере
   */
  async logOff() {
    try {
      if(!this.currentUser){
         // Получаем провайдер
        let provider = await this.__provider()

        await provider.LogOff()
        currentUser.reset()
      }
    } catch (res) {
      throw new Error(`Ошибка при попытке выйти из системы. \r\n ${res}`)
    }
  }


  /**
   * Получить токен для авторизации на веб сервере
   */
  getAuthHeader(){
    if(!this.currentUser){
      return undefined
    }
    let token = this.currentUser.access_token
    return {'Authorization':`Bearer ${token}`}
  }


  get currentUser(){
    return currentUser.get()
  }
}
