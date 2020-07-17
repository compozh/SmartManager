import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import auth from '@/utils/auth'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: window.appConfig.BASE_URL + (window.DOCKERMODE ? '/' : 'SmartManager/'),
  routes
})

router.history.getCurrentLocation = () => {
  let path = window.location.pathname
  const base = router.history.base

  // Removes base from path (case-insensitive)
  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}

// protection of paths from an unauthenticated access
const unProtectedRoutes = ['/login', '/error-404', '/error-500', '/network-error']

router.beforeEach(async (to, from, next) => {
  if (from.path === to.path) {
    return
  }
  if (unProtectedRoutes.includes(to.path)) {
    return next()
  }
  const token = await auth.getToken()
  if (token) {
    return next()
  }
  if (from.name !== 'login') {
    await router.push({ path: '/login', query: { to: to.path } })
  }
})

export default router
