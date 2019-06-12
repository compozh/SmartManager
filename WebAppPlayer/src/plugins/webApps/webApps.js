import Vue from 'vue'
import _ from 'lodash'
export class WebApps {

  __modulesManager;
  __application;

  /**
   * Конструктор
   * @param {object} dependencies Зависимости
   */
  constructor(dependencies) {

    this.__modulesManager = dependencies.modulesManager

    // this.__store = dependencies.store

    // if(!this.__store){
    //   throw new Error('Хранилище должно быть передано в виде зависимости .store')
    // }
    // if(!this.__coreRouter){
    //   throw new Error('Router должен быть передан в виде зависимости!')
    // }
    if(!this.__modulesManager){
      throw new Error('Менеджер пакетов должен быть передан в виде зависимости!')
    }

  }

  /** GraphQl провайдер */
  __provider() {
    return this.__modulesManager.getGraphQlCore()
  }

  /**  */
  __coreRouter(){
    return this.__modulesManager.getCoreRouter()
  }

  /**
   * Загрузить описание приложения из конструктора
   * @param {string} appId Идентификатор приложения
   */
  async LoadAppDescription(appId) {
    let provider = await this.__provider()
    let args = {
      query:
        'query q($appId : String) {\n  webapps{\n    application(applicationId:$appId)\n  }\n}',
      schema: 'WEBAPPS',
      variables: { appId },
      operationName: 'q'
    }
    let result = await provider.GrapgQlQuery(args)

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
      routes = routes.concat((section.Routes||[]).map(r=> (r.section = section)&& r))
    }

    // Формируем роуты в нужном формате
    this.__routes = _.orderBy(routes, ['Sort']).map(r => this.__generateRouteFromDescription(r, r.section))

    console.log(routes)
  }


  /**
   * Конвертировать маршрут из внутреннего описания в стандартный вид vueRouter
   * @param {*} route Объект описания маршрута
   * @param {*} section Раздел
   */
  __generateRouteFromDescription(route, section) {

    let components = _.orderBy(route.Components, 'Sort')
    // Если есть корневой компонент маршрута - помещаем все компоненты маршрута в корневой компонент
    if(route.RootComponent){
      route.RootComponent.ChildComponents = components
      components = [route.RootComponent]
    }

    let componentsObject = {}
    let componentsProperties = {}

    for (let index = 0; index < components.length; index++) {
      const component = components[index]
      // компонент - обёртка
      componentsObject[component.NameInRoute || 'default'] = Vue.component('common-component',Vue.extend(Vue.component('common-component')))

      // конвертируем компоненты из внутренного формата в стандартный формат vue
      let innerComp = this.__createComponentObject(component)

      // свойства компонента
      componentsProperties[component.NameInRoute || 'default'] = { component: innerComp }
    }

    // Объект маршрута
    return {
      name: route.Id,
      path: route.Path,
      // Компоненты в маршруте
      components: componentsObject,
      // Свойства компонентов
      props: componentsProperties,

      // Вложенные маршруты
      children: _.orderBy(route.Children||[], ['Sort']).map(r=>this.__generateRouteFromDescription(r,section)),
      // Метаинформация об уровне доступа и разделе приложения
      meta: {
        AllowAnonymous: route.AllowAnonymous,
        HideAfterLogin: route.HideAfterLogin,
        Section: { Id: section.Id, Properties: JSON.parse(section.Properties ||'{}')}
      }
    }
  }


  /**
   * Преобразование компонента из внутреннего формата в стандартный формат Vue
   * @param {*} component Описание компонента
   */
  __createComponentObject(component){
    let innerComp = {
      id: component.Id,
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


  /**
   * Получить компонент - представляющий загруженное приложение
   * @param {object} properties Параметры приложения
   */
  async GetApplicationComponent({ appId, properties }) {
    await this.LoadAppDescription(appId)

    let coreRouter = await this.__coreRouter()

    coreRouter.AddRoutes(this.__routes)

    let appComponent = {
      ...properties,
      render: h => h(this.__application.RootComponent.Name)
    }

    return appComponent
  }
}
