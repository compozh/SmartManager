import Vue from 'vue';
import Router from 'vue-router';
import Axios from 'axios'
import Login from './components/Login'
import common from "./components/CommonComponent"
Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: []
})
export default router;
Axios.post('http://localhost:5000/api/Core/GetApplication', undefined, {}).then(r => r.data).then(
  routes => {
    routes.pages.forEach((e) => {
      router.addRoutes(
        [{
          path: e.path,
          component: {
            render: function (createElement) {
              return createElement('common-component', {
                props: {
                  componentName: e.component
                }
              })
            }
          }
        }]);
    })
  });