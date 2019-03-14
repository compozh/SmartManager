import _ from "lodash";
import * as jsonpatcher from '../patching';

export default {
  name: "common-component",
  //////////////////////////////////////////////////
  //////              METHODS
  /////////////////////////////////////////////////
  methods: {
    /** Получить значение из хранилища по ссылке для использования в свойствах */
    getStoreValue(path) {
      var path = this.getStorePath(path);
      var object = this.$store.state.appData;
      if (!object) {
        return undefined
      }
      return jsonpatcher.get(this.$store.state.appData, path)
    },

    /** Обновить значение в хранилище (используется в модели) */
    updateStoreValue(path, value) {
      var path = this.getStorePath(path);
      this.$store.commit('updateData', [{ "op": "replace", path, value }]);
    },

    /** Путь к свойству в хранилище с учетом контекста */
    getStorePath(path){
      for (var storeScopeKey in this.storeScope) {        
        path = _.replace(path, new RegExp(`\\b(${storeScopeKey})\\b`), this.storeScope[storeScopeKey])
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
              storeScope: scope
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
      var val = this.getStoreValue(component.loop.source,storeScope)
      return _.map(val, (value, key) => {
        var scope = storeScope || {};
        scope[component.loop.itemName] = `${component.loop.source}/${key}`;
        return this.createCommonComponentInternal(component, scope, createElement)
      })
      
    },
    /** Вызов события из компонента по имени */
    callAction(eventName){
      var actionInfo = this.component.actions[eventName]
      this.$store.dispatch('CallAction', {source:this.component.Id, event:eventName, arguments:this.transfotmProps(actionInfo.arguments)})
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
      model = this.transfotmProps({value:this.component.model});
      model.callback = ($v) => {
        this.updateStoreValue(this.component.model.source, $v);
      }
    }


    // Вложенные компоненты
    // Компоненты в именованных слотах
    let componentsInNamedSlots =  this.slotGroups.map(slotGroup => {
      return createElement('template',  { slot: slotGroup.key } ,
        slotGroup.components.map(subComponent => this.createCommonComponent(subComponent, this.storeScope, createElement)))
    })
     // Компоненты в слоте по умолчанию
    let componentsInDefaultSlot = this.defaultSlotGroup.map(defSlotComp => this.createCommonComponent(defSlotComp,this.storeScope, createElement))

    // Формирование обработчиков событий
    
    
    let on = _.transform(this.component.actions || {}, (result, value, key)=>{
      result[key] = (event) => {
        this.callAction(key);
      }
    },{})
      

    // Создание корневого компонента
    return createElement(this.component.name, {
        attrs: {...this.transfotmProps(this.component.attrs)},
        model,
        on
      },
      // Наполнение корневого компонента дочерними
      [componentsInNamedSlots, componentsInDefaultSlot])
  }
};

