import Vue from 'vue'
import VueRouter from 'vue-router'
import {routes} from './routes'
import Vuetify from 'vuetify'

Vue.use(VueRouter)//метод use позволяет регестрировать глобальные расширения  все приложение видит VueRouter
Vue.use(Vuetify)
let router = new VueRouter({
	mode: 'history',//использовать в режиме history www.test.com/add
	routes,
	base: process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? "/skd/":""
})
console.log(process.env.NODE_ENV);

// Если маршрут требует авторизации, перенаправляем на логин
router.beforeEach((to, from, next) => {
	
	let token = sessionStorage.getItem('authToken');
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const unauthentificated = to.matched.some(record => record.meta.unauthentificated);
	
	if (requiresAuth && !token) {
		next('/login');
	} else if(unauthentificated && token){
		next('users');
	} else {
		next();
	}
})
export default router
