import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import 'vuetify/dist/vuetify.min.css';
import _ from 'lodash';
import {resetRouter} from './router';
import {i18n} from './plugins/i18n';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';

export const eventBus = new Vue(); // Шина событий

const req = require.context('@/components/', true, /\.(js|vue)$/i);
req.keys().map(key => {
  if (!req(key).default || !req(key).default.name) {
    return
  }
  return Vue.component(req(key).default.name, req(key).default)
});

Vue.use(Vuetify);
Vue.use(VueApollo);

// Cache implementation
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: new HttpLink({}),
  cache,
  connectToDevTools: true,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  i18n,
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount('#app');

// Загружаем приложение
store.dispatch("GetAppDescription", router.currentRoute.params.ApplicationId).then(() => {

  var app = store.state.applicationDescription;
  if (!app.Id) {
    return;
  }
  // Разделы приложения
  var sections = app.Sections || [];

  // Достаем роуты из разделов
  var routes = [];
  for (let index = 0; index < sections.length; index++) {
    const section = sections[index];
    routes = routes.concat((section.Routes || []).map(r => (r.section = section) && r))
  }
  // Формируем роуты в нужном формате
  routes = _.orderBy(routes, ["Sort"]).map(r => generateRouteFromDescription(r, r.section))

  // Сбрасываем старый роутер
  resetRouter([])

  // Обработка доступа к роутам
  router.beforeEach((to, from, next) => {
    routerBeforeEachFunction(to, from, next)
  })


  // формируем новый роутер
  router.addRoutes([{
    path: `/${app.Id}`,
    component: getInternalComponentDescription(app.RootComponent),
    children: routes
  }, {path: '*', redirect: `/${app.Id}`}])


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

function createComponentObject(com) {
  let innerComp = {
    id: com.Name,
    name: com.Name,
    // источник данных для компонента
    datasource: com.DataSource ? {
      query: com.DataSource,
      schema: com.DataSourceSchema
    } : undefined,
    attrs: {},
    slot: com.Slot,
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
    //  Для динамического обновления данных при смене роутинга и обновлении компонента
    beforeRouteUpdate(to, from, next) {
      next();
      for (var cur of  this.$children) {
        if (cur.beforeRouteUpdate) {
          cur.beforeRouteUpdate(to, from);
        }
      }
    },
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

// Обработка пути в маршруте для корректного сравнения
function normalizePath(path) {
  var result = (path || "").toLowerCase();
  if (!result.endsWith("/")) {
    result += "/"
  }
  return result;
}

/** Валидация доступа пользователя к определенным маршрутам */
let routerBeforeEachFunction = (to, from, next) => {
  // Если переходим на логин, запоминаем путь, для возвращения

  if (normalizePath(to.path).endsWith("/login/")) {
    var backPath = from.path;
    if (normalizePath(to.path) == normalizePath(from.path)) {
      backPath = `/${store.state.applicationDescription.Id}/`
    }
    to.params["routeToBack"] = backPath
  }
  // Если запрещен анонимный доступ, и отсутствует текущий пользователь, перенаправляем на логин
  if (!to.meta.AllowAnonymous && !store.getters.getCurrentUser) {

    next({path: `/${store.state.applicationDescription.Id}/LOGIN`});

    return;
  }
  if (to.meta.HideAfterLogin && store.getters.getCurrentUser) {
    next({path: `/${store.state.applicationDescription.Id}/`});
    return;
  }
  next();
}


let generateRouteFromDescription = (route, section) =>
  ({
    name: route.Id,
    path: route.Path,
    // Компоненты в маршруте
    components: createComponentsForRoute(route.RootComponent ? [concatRootCompAndComponents(route.RootComponent, route.Components)] : _.orderBy(route.Components, "Sort")),
    // Вложенные маршруты
    children: _.orderBy(route.Children || [], ["Sort"]).map(r => generateRouteFromDescription(r, section)),
    meta: {
      AllowAnonymous: route.AllowAnonymous,
      HideAfterLogin: route.HideAfterLogin,
      Section: {Id: section.Id, Properties: JSON.parse(section.Properties || "{}")}
    }
  })

let concatRootCompAndComponents = (rootComponent, components) => ({
  Id: rootComponent.Id,
  Name: rootComponent.Name,
  Properties: rootComponent.Properties,
  Slot: rootComponent.Slot,
  Sort: rootComponent.Sort,
  DataSource: rootComponent.DataSource,
  ChildComponents: _.orderBy(components, "Sort")
})
