console.log('WebAppsCore is loaded!')

let Vue = undefined

import _ from 'lodash'
import store from '../store/index'
export class WebApps {
  /**
   * Конструктор
   * @param {object} dependencies Зависимости
   */
  constructor(vue, options, dependencies) {
    // Импортируемые зависимости
    this.__vm = undefined
    this.__router = undefined
    this._vue = undefined
    // Внутренние свойства
    this.__application = undefined
    this.__routes = undefined

    this.__router = dependencies.router
    this.__options = options
    this.__axios = dependencies.axios
    this.__store = dependencies.store
    Vue = vue
    this.__vm = new Vue({
      router: dependencies.router
    })

    if (!this.__axios) {
      throw new Error('Axios должен быть передан в виде зависимости .axios')
    }


    // проверка и инициализация роутера
    if (!this.__router) {
      throw new Error('router должен быть передан в виде зависимости .router')

    }

  }

  /** GraphQl провайдер */
  get __provider() {
    return this.__vm.$graphQlCore
  }

  /** Плагин работы с router */
  get __coreRouter() {
    return this.__vm.$CoreRouter
  }

  /**
   * Загрузить описание приложения из конструктора
   * @param {string} appId Идентификатор приложения
   */
  async LoadAppDescription(appId) {

    let args = {
      query:
        'query q($appId : String) {\n  webapps{\n    application(applicationId:$appId)\n  }\n}',
      schema: 'WEBAPPS',
      variables: { appId },
      operationName: 'q'
    }
    let result = await this.__provider.GrapgQlQuery(args)
    // Ошибка загрузки
    if (!result.data.data || !result.data.data.webapps || !result.data.data.webapps.application) {
      throw new Error(`Ошибка загрузки приложения "${appId}"`)
    }
    // Нет приложения
    if (result.data.data.webapps.application == 'null') {
      throw new Error(`Отсутствует описание приложения "${appId}"`)
    }
    let app = JSON.parse(result.data.data.webapps.application)

    // конвертация приложения в формат Vue + VueRouter
    this.__application = app
    this.__convertApplicationToInternalFormat(app)

    // загружаем в роутер маршруты приложения
    this.__setUpApplicationRouting()
    // записываем в store описание приложения
    this.__store.commit('WebApps/SetAppDescription', app)
  }

  /**
   * Конвертировать внетренний формат описания приложения к стандартному виду Vue
   * @param {object} app Структура приложения
   */
  __convertApplicationToInternalFormat(app) {
    // Разделы приложения
    let sections = app.Sections || []
    // Достаем роуты из разделов
    var routes = []
    for (let index = 0; index < sections.length; index++) {
      const section = sections[index]
      routes = routes.concat((section.Routes || []).map(r => (r.section = section) && r))
    }

    // Корневой маршрут со всеми вложенными маршрутами
    let r = {
      Components: [app.RootComponent],
      Id: '',
      Path: `/${app.Id}`,
      Children: routes
    }

    // Формируем роуты в нужном формате
    this.__routes = [this.__generateRouteFromDescription(r, {})]

  }


  /**
   * Конвертировать маршрут из внутреннего описания в стандартный вид vueRouter
   * @param {*} route Объект описания маршрута
   * @param {*} section Раздел
   */
  __generateRouteFromDescription(route, section) {

    section = section || {}
    let components = _.orderBy(route.Components, 'Sort')
    // Если есть корневой компонент маршрута - помещаем все компоненты маршрута в корневой компонент
    if (route.RootComponent) {
      route.RootComponent.ChildComponents = components
      components = [route.RootComponent]
    }

    let componentsObject = {}

    for (let index = 0; index < components.length; index++) {
      const component = components[index]

      componentsObject[component.NameInRoute || 'default'] = this.__getInternalComponentDescription(component)
    }

    // Объект маршрута
    return {
      name: route.Id,
      path: route.Path,
      // Компоненты в маршруте
      components: componentsObject,
      // Вложенные маршруты
      children: _.orderBy(route.Children || [], ['Sort']).map(r => this.__generateRouteFromDescription(r,r.section)),
      // Метаинформация об уровне доступа и разделе приложения
      meta: {
        AllowAnonymous: route.AllowAnonymous,
        HideAfterLogin: route.HideAfterLogin,
        Section: { Id: section.Id, Properties: JSON.parse(section.Properties || '{}')}
      }
    }
  }


  /**
   * Преобразование компонента из внутреннего формата в стандартный формат Vue
   * @param {*} component Описание компонента
   */
  __createComponentObject(component) {
    let innerComp = {
      id: component.Name,
      name: component.Name,
      // источник данных для компонента
      datasource: component.DataSource ? {
        query: component.DataSource,
        schema: component.DataSourceSchema
      } : undefined,
      attrs: {},

      slot: component.Slot,
      children: _.orderBy(component.ChildComponents, 'Sort').map(subCom => this.__createComponentObject(subCom))
    };


    // конвертируем свойства к нужному виду:
    (component.Properties || []).forEach(property => {
      innerComp.attrs[property.Name] = property.Value
    })
    return innerComp
  }

  // Генерируем компонент по его описанию
  __getInternalComponentDescription(com) {

    let t = this
    return ({
    //  Для динамического обновления данных при смене роутинга и обновлении компонента
      beforeRouteUpdate(to, from, next) {
        next()
        for (var cur of  this.$children) {
          if (cur.beforeRouteUpdate) {
            cur.beforeRouteUpdate(to, from)
          }
        }
      },
      render(h) {
      // приводим компонент к нужному формату:

        let innerComp = t.__createComponentObject(com)

        // отрисовка компонента
        return h('WebApps-rs-CommonComponent', {
          props: {
            component: innerComp
          }
        })
      }
    })
  }

  /**
   * Получить компонент - представляющий загруженное приложение
   * @param {object} properties Параметры приложения
   */
  async GetApplicationComponent({ properties }) {

    // ID приложения получаем из параметров
    this.__appId = this.__vm.$route.params.ApplicationId
    await this.LoadAppDescription(this.__appId)


    // Подмешиваем в зависимости роутер
    properties = {
      router: this.__router,
      ...properties
    }


    let appComponent = {
      ...properties,
      render: h => h('router-view')
    }

    return appComponent
  }


  /**
   * Инициализация Vue router с маршрутами, описанными в конструкторе приложений
   */
  async __setUpApplicationRouting() {
    this.__coreRouter.SetRoutes(this.__routes)
  }



  async LoadDataForComponent({datasource}) {
    return this.__axios({
      method: 'POST',
      url: this.__options.GrapgQlUrl + 'api/graphql',
      withCredentials: true,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
      data: {SchemaName: datasource.schema, query: datasource.query}
    })
  }


}

