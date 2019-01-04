import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import Vuetify from 'vuetify'
Vue.use(VueRouter)//метод use позволяет регестрировать глобальные расширения  все приложение видит VueRouter
Vue.use(Vuetify)
let router = new VueRouter({
  mode: 'history',//использовать в режиме history www.test.com/add
  //есть два режима создания url hash(#) и history
  //по умолчанию будет hash www.test.com/#/add
  routes,
})

export default router
