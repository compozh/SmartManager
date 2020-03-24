import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import auth from '@/utils/auth'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL + 'SmartManager/',
  routes
})

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
  if (from.name !== 'login') {
    await router.push({ path: '/login', query: { to: to.path } })
  }
})

export default router
