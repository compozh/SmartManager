import _ from "lodash";
import * as jsonpatcher from '../patching';
import {
  create
} from "domain";

export default {
  name: "common-component",
  //////////////////////////////////////////////////
  //////              METHODS
  /////////////////////////////////////////////////
  methods: {
    /** Получить значение из хранилища по ссылке для использования в свойствах */
    getStoreValue(path) {
      var path = this.getStorePath(path);
      var object = this.$store.getters.getAppData[this.internalDataSourceId];
      if (!object) {
        return undefined
      }
      return jsonpatcher.get(this.$store.getters.getAppData[this.internalDataSourceId], path)
    },

    /** Обновить значение в хранилище (используется в модели) */
    updateStoreValue(path, value) {
      var path = this.getStorePath(path);
      this.$store.commit('updateData', {
        key: this.internalDataSourceId,
        patchlist: [{
          "op": "replace",
          path,
          value
        }]
      });
    },

    /** Путь к свойству в хранилище с учетом контекста */
    getStorePath(path) {
      for (var storeScopeKey in this.storeScope) {
        path = _.replace(path, new RegExp(`\\b(${storeScopeKey})\\b`), this.storeScope[
          storeScopeKey])
      }
      return path;
    },

    /** Обработать ссылки на хранилище в объекте свойств */
    transfotmProps(props) {
      return _.transform(props, (result, value, key) => {
        // свойство - ссылка на хранилище
        if (typeof value == 'object' && value.source) {
          result[key] = this.getStoreValue(value.source)
          return
        }
        result[key] = value
      }, {})
    },

    /** Отрисока компонента */
    createCommonComponentInternal(component, scope, createElement) {
      switch (component.type) {
        case "component":
          return createElement('common-component', {
            props: {
              component: component.value,
              storeScope: scope,
              dataSourceId: this.internalDataSourceId
            }
          })
        case "raw":
          return component.value;
      }
    },

    /** Отрисовка компонента в зависимости от типа */
    createCommonComponent(component, storeScope, createElement) {
      // Единичный компонент
      if (!component.loop) {
        return this.createCommonComponentInternal(component, storeScope, createElement)
      }

      // Обработка отрисовки списков
      var val = this.getStoreValue(component.loop.source, storeScope)
      return _.map(val, (value, key) => {
        var scope = storeScope || {};
        scope[component.loop.itemName] = `${component.loop.source}/${key}`;
        return this.createCommonComponentInternal(component, scope, createElement)
      })

    },
    /** Вызов события из компонента по имени */
    callAction(eventName) {
      var actionInfo = this.internalComponent.actions[eventName]
      this.$store.dispatch('CallAction', {
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
      var groups = _.groupBy(this.internalComponent.content, el => {
        return el.slot == "default" || !el.slot ? "" : el.slot;
      });
      var a = _.keys(groups).map(el => ({
        key: el,
        components: groups[el]
      }));
      return _.filter(a, el => !!el.key);
    },
    // компоненты в слотах по умолчанию
    defaultSlotGroup() {
      return _.filter(this.internalComponent.content, el => !el.slot || el.slot == "default")
    },
    internalComponent() {
      if (this.componentName) {
        return this.$store.getters.getAppLayout[this.componentName]
      } else {
        return this.component
      }
    },
    internalDataSourceId() {
      return this.internalComponent.dataSourceId || this.dataSourceId
    }

  },


  //////////////////////////////////////////////////
  ////              STATIC PROPERTIES
  //////////////////////////////////////////////////

  props: {
    componentName: {
      type: String,
      required: false
    },
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

  // default: function(){return this.imperialComponent}

  //////////////////////////////////////////////////
  /////             RENDER FUNCTION
  //////////////////////////////////////////////////
  render(createElement) {

    if (this.componentName && !this.$store.state.appLayout[this.componentName]) {
      this.$store.dispatch("GetAppLayout", this.componentName);
    }

    if (!this.internalComponent) {
      return undefined;
    }

    if (this.internalDataSourceId && !this.$store.state.appData[this.internalDataSourceId]) {
      this.$store.dispatch('GetAppData', this.internalDataSourceId);
    }
    // модель компонента:
    let model;
    if (this.internalComponent.model) {
      model = this.transfotmProps({
        value: this.internalComponent.model
      });
      model.callback = ($v) => {
        this.updateStoreValue(this.internalComponent.model.source, $v);
      }
    }


    // Вложенные компоненты
    // Компоненты в именованных слотах
    let componentsInNamedSlots = this.slotGroups.map(slotGroup => {
      return createElement('template', {
          slot: slotGroup.key
        },
        slotGroup.components.map(subComponent => this.createCommonComponent(subComponent,
          this.storeScope, createElement)))
    })
    // Компоненты в слоте по умолчанию
    let componentsInDefaultSlot = this.defaultSlotGroup.map(defSlotComp => this.createCommonComponent(
      defSlotComp, this.storeScope, createElement))

    // Формирование обработчиков событий


    let on = _.transform(this.internalComponent.actions || {}, (result, value, key) => {
      result[key] = (event) => {
        this.callAction(key);
      }
    }, {})


    // Создание корневого компонента
    return createElement(this.internalComponent.name, {
        attrs: {
          ...this.transfotmProps(this.internalComponent.attrs)
        },
        model,
        on
      },
      // Наполнение корневого компонента дочерними
      [componentsInNamedSlots, componentsInDefaultSlot])
  },

};