
let GlobalVueRouter = undefined

export default class Router {
  __router;

  /**
   * Конструктор
   * @param {VueRouter} router Vue router
   */
  constructor(router, { VueRouter }) {
    this.__router = router
    if (!this.__router) {
      throw new Error('экземпляр VueRouter должен быть передан!')
    }
    this.__router.beforeEach((to, from, next) => this.resolveAccess(to, from, next))

    if (!VueRouter) {
      throw new Error('VueRouter должен быть передан в зависимостях!')
    }

    GlobalVueRouter = VueRouter
  }


  /**
   * Добавить маршруты в роутинг
   * @param {Array<Object>} routes Коллекция маршрутов, которые необходимо добавить
   */
  SetRoutes(routes) {
    this._resetRouter()
    this.__rootPath = routes[0].path
    //  this.__router.beforeEach((to, from, next) => this.resolveAccess(to, from, next))
    this.__router.addRoutes(routes)

  }

  /**
   * Создание нового роутера
   */
  _createRouter() {
    return new GlobalVueRouter({
      mode: this.__router.options.mode,
      base: this.__router.options.base
    })
  }


  // Сброс роутера
  _resetRouter() {
    const newRouter = this._createRouter()
    this.__router.matcher = newRouter.matcher
    this.__router.history.current.matched.splice(0, this.__router.history.current.matched.length)
  }


  /** Валидация доступа пользователя к определенным маршрутам */
  resolveAccess(to, from, next) {

    let rootPath = this.__rootPath
    // Если переходим на логин, запоминаем путь, для возвращения

    if (normalizePath(to.path).endsWith('/login/')) {
      let backPath = from.path
      // переход в корень, если не определили откуда пришли
      if (normalizePath(to.path) == normalizePath(from.path)) {
        backPath = rootPath
      }
      to.params['routeToBack'] = backPath
    }

    // Если запрещен анонимный доступ, и отсутствует текущий пользователь, перенаправляем на логин
    if (!to.meta.AllowAnonymous && !this.__router.app.$authentication.currentUser) {

      next({path: `${rootPath}/LOGIN`})

      return
    }
    // Если маршрут помечен как доступный только для публичных пользователей, скрываем его если уже есть текущий пользователь
    if (to.meta.HideAfterLogin && this.__router.app.$authentication.currentUser) {
      next({path: rootPath})
      return
    }
    next()
  }
}



// Обработка пути в маршруте для корректного сравнения
function normalizePath(path) {
  var result = (path || '').toLowerCase()
  if (!result.endsWith('/')) {
    result += '/'
  }
  return result
}
