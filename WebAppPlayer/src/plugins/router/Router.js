import VueRouter from 'vue-router'
export default class Router {
  /**
   * Конструктор
   * @param {VueRouter} router Vue router
   */
  constructor(router) {
    this.__router = router
    if (!this.__router)
    {
      throw new Error('VueRouter должен быть передан!')
    }

  }

  __router;

  /**
   * Добавить маршруты в роутинг
   * @param {Array<Object>} routes Коллекция маршрутов, которые необходимо добавить
   */
  AddRoutes(routes) {

    debugger
    let router = this._createRouter()


  }

  _createRouter(){

    

    return new VueRouter({
      mode: this.__router.options.mode,
      base: this.__router.options.base
    })
  }


  // Сброс роутера
  _resetRouter() {
    const newRouter = this._createRouter()
    this.__router.matcher = newRouter.matcher

    this.__router.history.current.matched.splice(0, this.__router.history.current.matched.length)
    //router.options = newRouter.options

  }
}
