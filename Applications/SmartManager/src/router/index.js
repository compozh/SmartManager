import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

import auth from '@/utils/auth'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: window.appConfig.BASE_URL + 'SmartManager/',
  routes
})

router.history.getCurrentLocation = () => {
  let path = window.location.pathname
  let base = router.history.base

  // Removes base from path (case-insensitive)
  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}

// protection of paths from an unauthenticated access
const unProtectedRoutes = ['/login', '/error-404', '/error-500']

router.beforeEach(async (to, from, next) => {
  if (unProtectedRoutes.includes(to.path)) {
    return next()
  }
  const token = await auth.getToken()
  if (token) {
    return next()
  }
  if (from.path !== '/') {
    await router.push({path: '/login', query: { to: to.path }})
  }
  if (from.name !== 'login') {
    await router.push({path: '/login', query: { to: to.path }})
  }
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

// Роутер по умолчанию
export default router
