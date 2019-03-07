import Vue from 'vue'
import axios from 'axios'
import router from './router/index'
import store from './store'
import {sync} from 'vuex-router-sync'
import App from 'components/app-root'

Vue.prototype.$http = axios


sync(store, router)

const app = new Vue({
	store,
	router,
	...App
})

export {
	app,
	router,
	store
}

(function registerServiceWorker() {
	// регистрирует скрипт sw в поддерживаемых браузерах
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js', { scope: '/' }).then(() => {
		  console.log('Service Worker registered successfully.');
		}).catch(error => {
		  console.log('Service Worker registration failed:', error);
		});
	  }
	  const rootDir = '/';

})();
