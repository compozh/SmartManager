import _ from 'lodash'
import * as jsonpatcher from '../api/patching'
import gql from 'graphql-tag'


export default {
  name: 'common-component',
  data() {
    return {
      routerParam: {}
    }
  },


  beforeRouteUpdate(to, from, next){
    next()

    // получение данных для компонента
    this.loadDataForComponents(false)
    for (var cur of this.$children) {
      if (cur.beforeRouteUpdate) {
        cur.beforeRouteUpdate(to, from)
      }
      if (cur.$children) {
        for (var chilCur of cur.$children) {
          if (chilCur.beforeRouteUpdate) {
            chilCur.beforeRouteUpdate(to, from)
          }
        }
      }
    }
  },


  //////////////////////////////////////////////////
  //////              METHODS
  /////////////////////////////////////////////////
  methods: {

    // Функция для получения данных компонента, принимает boolean тип,
    // который указывает является это первой загрузкий или обновление даных по роутингу на одной странице
    loadDataForComponents(firstLoad) {
      if (this.internalComponent.datasource) {
        var datasource = JSON.parse(JSON.stringify(this.internalComponent.datasource))
        let reg = new RegExp('\\$route\\.params\\.([a-zA-Z0-9_]*)', 'gi')
        let matches = reg.exec(datasource.query)
        if (matches != null) {
          // получаем значение параметра из роутера
          let paramName = matches[1]
          let paramValue = this.$route.params[paramName]

          if (this.routerParam[paramName] == paramValue) {
            return
          }
          datasource.query = datasource.query.replace(reg, `"${paramValue}"`)
          this.routerParam[paramName] = paramValue
        } else if (!firstLoad) {
          return
        }


        // Переопределяем HttpLink в заголовке под нужную схему
        this.$apolloProvider.defaultClient.link.constructor({
          uri: myConfig.GrapgQlUrl + "api/graphql",
          headers: {...this.$authentication.getAuthHeader(),
          'schema' : datasource.schema
        }})

        this.$store.dispatch("WebApps/LoadDataForComponent", {key:this.internalComponent.id, datasource})
        // this.$apollo.addSmartQuery('myData', {
        //   query: gql` query ${datasource.query} `,
        //   manual: true,
        //   result (data) {
        //     var key = this.internalComponent.id
        //     this.$store.dispatch("WebApps/zzz", {key, data})
        //   },
        // })
      }
    },
    /** Получить значение из хранилища по ссылке для использования в свойствах */
    getStoreValue(path) {
      path = this.getStorePath(path)
      console.log(path);
      var object = this.$store.getters['WebApps/getAppData'](this.internalComponent.id)
      if (!object) {
        return undefined
      }
      return jsonpatcher.get(object, path)
    },

    /** Обновить значение в хранилище (используется в модели) */
    updateStoreValue(path, value) {
      path = this.getStorePath(path)
      this.$store.commit('WebApps/updateData', {
        key: this.internalDataSourceId,
        patchlist: [
          {
            op: 'replace',
            path,
            value
          }
        ]
      })
    },

    /** Путь к свойству в хранилище с учетом контекста */
    getStorePath(path) {
      for (var storeScopeKey in this.storeScope) {
        path = _.replace(
          path,
          new RegExp(`\\b(${storeScopeKey})\\b`),
          this.storeScope[storeScopeKey]
        )
      }
      return path
    },

    /** Обработать ссылки на хранилище в объекте свойств */
    transfotmProps(props) {
      return _.transform(
        props,
        (result, value, key) => {
          // свойство - ссылка на хранилище
          if (typeof value == 'object' && value.source) {
            result[key] = this.getStoreValue(value.source)
            return
          }
          if (typeof value == 'string' && value.startsWith('@ds/')) {
            value = value.replace('@ds/', '')
            result[key] = this.getStoreValue(value)
            return
          }
          result[key] = value
        },
        {}
      )
    },

    /** Отрисока компонента */
    createCommonComponentInternal(component, scope, h) {
      return h('WebApps-rs-CommonComponent', {
        props: {
          component: component,
          storeScope: scope,
          dataSourceId: this.internalDataSourceId
        }
      })
    },

    /** Отрисовка компонента в зависимости от типа */
    createCommonComponent(component, storeScope, h) {
      // Единичный компонент
      if (!component.loop) {
        return this.createCommonComponentInternal(component, storeScope, h)
      }

      // Обработка отрисовки списков
      var val = this.getStoreValue(component.loop.source, storeScope)
      return _.map(val, (value, key) => {
        var scope = storeScope || {}
        scope[component.loop.itemName] = `${component.loop.source}/${key}`
        return this.createCommonComponentInternal(component, scope, h)
      })
    },
    /** Вызов события из компонента по имени */
    callAction(eventName) {
      var actionInfo = this.internalComponent.actions[eventName]
      this.$store.dispatch('WebApps/CallAction', {
        source: this.internalComponent.Id,
        event: eventName,
        arguments: this.transfotmProps(actionInfo.arguments)
      })
    }
  },

  //////////////////////////////////////////////////
  //////            COMPUTED PROPERTIES
  /////////////////////////////////////////////////
  computed: {
    // компоненты в именованых слотах
    slotGroups() {
      var groups = _.groupBy(this.internalComponent.children, el => {
        return el.slot == 'default' || !el.slot ? '' : el.slot
      })
      var a = _.keys(groups).map(el => ({
        key: el,
        components: groups[el]
      }))
      return _.filter(a, el => !!el.key)
    },
    // компоненты в слотах по умолчанию
    defaultSlotGroup() {
      return _.filter(this.internalComponent.children, el => !el.slot || el.slot == 'default')
    },
    internalComponent() {
      // if (this.componentName) {
      //   return this.$store.getters.getAppLayout[this.componentName]
      // } else {
      return this.component
      //}
    },
    internalDataSourceId() {
      return this.internalComponent.dataSourceId || this.dataSourceId
    }
  },

  //////////////////////////////////////////////////
  ////              STATIC PROPERTIES
  //////////////////////////////////////////////////

  props: {
    dataSourceId: {
      type: String,
      required: false
    },
    component: {
      type: Object,
      required: false
    },
    storeScope: {
      type: Object,
      required: false
    }
  },
  beforeMount() {
    // получение данных для компонента
    this.loadDataForComponents(true)
  },

  //////////////////////////////////////////////////
  /////             RENDER FUNCTION
  //////////////////////////////////////////////////
  render(h) {
    if (!this.internalComponent) {
      return undefined
    }

    // модель компонента:
    let model
    if (this.internalComponent.model) {
      model = this.transfotmProps({
        value: this.internalComponent.model
      })
      model.callback = $v => {
        this.updateStoreValue(this.internalComponent.model.source, $v)
      }
    }

    // Вложенные компоненты
    // Компоненты в именованных слотах
    let componentsInNamedSlots = this.slotGroups.map(slotGroup => {
      return h(
        'template',
        {
          slot: slotGroup.key
        },
        slotGroup.components.map(subComponent =>
          this.createCommonComponent(subComponent, this.storeScope, h)
        )
      )
    })
    // Компоненты в слоте по умолчанию
    let componentsInDefaultSlot = this.defaultSlotGroup.map(defSlotComp =>
      this.createCommonComponent(defSlotComp, this.storeScope, h)
    )

    // Формирование обработчиков событий

    let on = _.transform(
      this.internalComponent.actions || {},
      (result, value, key) => {
        result[key] = () => {
          this.callAction(key)
        }
      },
      {}
    )

    // Создание корневого компонента
    return h(
      this.internalComponent.name,
      {
        attrs: {
          ...this.transfotmProps(this.internalComponent.attrs)
        },
        model,
        on
      },
      // Наполнение корневого компонента дочерними
      [componentsInNamedSlots, componentsInDefaultSlot]
    )
  }
}
