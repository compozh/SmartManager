import Vue from 'vue'
import VueRouter from 'vue-router'
import {routes} from './routes'
import Vuetify from 'vuetify'

Vue.use(VueRouter)//метод use позволяет регестрировать глобальные расширения  все приложение видит VueRouter
Vue.use(Vuetify)
let router = new VueRouter({
	mode: 'history',//использовать в режиме history www.test.com/add
	routes,
})


// Если маршрут требует авторизации, перенаправляем на логин
router.beforeEach((to, from, next) => {
	
	
	let token = sessionStorage.getItem('authToken');
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	if (requiresAuth && !token) {
		next('/login');
		console.log('all Not OK')
	} else {
		next();
	}
})
export default router
