import _ from "lodash";
import * as jsonpatcher from '../patching';

export default {
  name: "common-component",
  //////////////////////////////////////////////////
  //////              METHODS
  /////////////////////////////////////////////////
  methods: {
    /** Получить значение из хранилища по ссылке для использования в свойствах */
    getStoreValue(path,storeScope) {
      var path = this.getStorePath(path, storeScope);
      var object = this.$store.state.appData;
      if (!object) {
        return undefined
      }
      return jsonpatcher.get(this.$store.state.appData, path)
    },

    /** Обновить значение в хранилище (используется в модели) */
    updateStoreValue(path,storeScope, value) {
      var path = this.getStorePath(path, storeScope);
      this.$store.commit('updateData', [{ "op": "replace", path, value }]);
    },

    /** Путь к свойству в хранилище с учетом контекста */
    getStorePath(path, storeScope){
      storeScope = storeScope || {};
      for (var storeScopeKey in storeScope) {
        path = _.replace(path, new RegExp(`\\b(${storeScopeKey})\\b`), storeScope[storeScopeKey])
      }
      return path;
    },

    /** Обработать ссылки на хранилище в объекте свойств */
    transfotmProps(props, storeScope) {
      return _.transform(props, (result, value, key) => {
        // свойство - ссылка на хранилище
        if (typeof value == 'object' && value.source) {
          result[key] = this.getStoreValue(value.source, storeScope)
          return
        }
        result[key] = value
      }, {})
    },

    createCommonComponentInternal(component, scope, createElement) {
      switch (component.type) {
        case "component":
          return createElement('common-component', {
            props: {
              component: component.value,
              storeScope: scope
            }
          })
        case "raw":
          return component.value;
      }
    },

    /**
     * Отрисовка компонента в зависимости от типа
     * @param {*} component Отрисовываемый компонент
     * @param {*} createElement Функция отрисовки компонента
     */
    createCommonComponent(component, storeScope, createElement) {
      if (!component.loop) {
        return this.createCommonComponentInternal(component, storeScope, createElement)  
      }
      
      // Обработка отрисовки списков
      var val = this.getStoreValue(component.loop.source,storeScope)
      return _.map(val, (value, key) => {
        var scope = storeScope || {};
        scope[component.loop.itemName] = `${component.loop.source}/${key}`;
        return this.createCommonComponentInternal(component, scope, createElement)
      })
      
    }
  },


  //////////////////////////////////////////////////
  //////            COMPUTED PROPERTIES
  /////////////////////////////////////////////////
  computed: {
    // компоненты в именованых слотах
    slotGroups() {
      var groups = _.groupBy(this.component.content, el => {
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
      return _.filter(this.component.content, el => !el.slot || el.slot == "default")
    }
  },


  //////////////////////////////////////////////////
  ////              STATIC PROPERTIES
  //////////////////////////////////////////////////

  props: {component:{type:Object, required: false}, storeScope:{type:Object, required: false}},
  
  
  //////////////////////////////////////////////////
  /////             RENDER FUNCTION
  //////////////////////////////////////////////////
  render(createElement) {
    if (!this.component) {
      return undefined;
    }
    // модель компонента:
    let model;
    if(this.component.model){
      model = this.transfotmProps({value:this.component.model}, this.storeScope);
      model.callback = ($v) => {
        this.updateStoreValue(this.component.model.source, this.storeScope, $v);
      }
    }
    
    // Создание корневого компонента
    return createElement(this.component.name, {
        attrs: {
          ...this.transfotmProps(this.component.attrs, this.storeScope)
        },
        model
      },
      // Наполнение корневого компонента дочерними
      [
        // Компоненты в именованных слотах
        this.slotGroups.map(slotGroup => {
          return createElement('template', slotGroup.key && slotGroup.key != "default" ? {
              slot: slotGroup.key
            } : undefined,
            slotGroup.components.map(subComponent => this.createCommonComponent(subComponent, this.storeScope,
              createElement)))
        }),
        // Компоненты в слоте по умолчанию
        this.defaultSlotGroup.map(defSlotComp => this.createCommonComponent(defSlotComp,this.storeScope,
          createElement))
      ])
  }
};