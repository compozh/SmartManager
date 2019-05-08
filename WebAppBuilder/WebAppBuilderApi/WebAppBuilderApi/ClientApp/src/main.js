import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import 'vuetify/dist/vuetify.min.css';
import _ from 'lodash';
import {  resetRouter } from './router';
import {i18n} from './plugins/i18n';

const req = require.context('@/components/', true, /\.(js|vue)$/i);
req.keys().map(key => {

  return Vue.component(req(key).default.name, req(key).default)
});

Vue.config.productionTip = false;
Vue.use(Vuetify);
new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');

// Загружаем приложение
store.dispatch("GetAppDescription", router.currentRoute.params.ApplicationId).then(() => {
  var app = store.state.applicationDescription;
  // Формируем роуты
  var routes =  _.orderBy(app.Routes||[], ["Sort"]).map(generateRouteFromDescription)
  // Сбрасываем старый роутер
  resetRouter([])


  //var loginRouteExists = routes.some(el=>(el.name||"").toLowerCase() == "login")

  // Обработка доступа к роутам
  router.beforeEach((to, from, next) => { routerBeforeEachFunction(to, from, next) })


  // формируем новый роутер
  router.addRoutes([{
    path: `/${app.Id}`,
    component: getInternalComponentDescription(app.RootComponent),
    children: routes
  }, {path:'*', redirect:`/${app.Id}`}])


})

// Устанавливаем текущего пользователя
store.dispatch("GetCurrentUser");

// Конвертация массива в объект
const arrayToObject = (array, keyField) =>
  (array || []).reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})

function createComponentsForRoute(components) {
  return arrayToObject(components.map(com => getInternalComponentDescription(com)), "name")
}

function createComponentObject(com){
  let innerComp = {
    id: com.Id,
    name: com.Name,
    // источник данных для компонента
    datasource: com.DataSource ? {
      query: com.DataSource,
      schema: com.DataSourceSchema
    } : undefined,
    attrs: {},
    slot:com.Slot,
    children: _.orderBy(com.ChildComponents, "Sort").map(subCom => createComponentObject(subCom))
  };
   // конвертируем свойства к нужному виду:
   (com.Properties || []).forEach(property => {
    innerComp.attrs[property.Name] = property.Value;
  });
  return innerComp;
}


// Генерируем компонент по его описанию
function getInternalComponentDescription(com) {
  return ({
    name: com.NameInRoute || "default",
    render(h) {
      // приводим компонент к нужному формату:

      let innerComp = createComponentObject(com);

      // отрисовка компонента
      return h('common-component', {
        props: {
          component: innerComp
        }
      })
    }
  })

}
/** Валидация доступа пользователя к определенным маршрутам */
let routerBeforeEachFunction = (to,from, next)=>{
    // Если переходим на логин, запоминаем путь, для возвращения
    if ((to.path || "").endsWith("login")) {
      var backPath = from.path;
      if (to.path == from.path) {
        backPath = `/${store.state.applicationDescription.Id}`
      }
      to.params["routeToBack"] = backPath
    }
    // Если запрещен анонимный доступ, и отсутствует текущий пользователь, перенаправляем на логин
    if (!to.meta.AllowAnonymous && !store.getters.getCurrentUser) {

      next({path: "login"});

      return;
    }
    next();
}


let generateRouteFromDescription = (route) =>
  ({
    name: route.Id,
    path: route.Path,
    // Компоненты в маршруте
    components: createComponentsForRoute(_.orderBy(route.Components, "Sort")),
    // Вложенные маршруты
    children: _.orderBy(route.Children||[], ["Sort"]).map(generateRouteFromDescription),
    meta: {
      AllowAnonymous: route.AllowAnonymous
    }
  })


