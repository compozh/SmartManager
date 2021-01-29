import auth from '@it-enterprise/jwtauthentication'
import router from '@/router'
import store from '@/store'

const setRefreshLoader = loader => store.commit('SET_REFRESH_LOADER', loader)
// Authentication configuration
auth.config({
  baseUrl: window.appConfig.GqlUrl,
  webUrl: `${window.location.origin}${window.appConfig.BASE_URL}${window.DOCKERMODE ? '/' : 'SmartManager/'}`,
  oidc: window.appConfig.oidc,
  onError: e => {
    switch (true) {
      case e.response && e.response.status === 400:
        router.push({ name: 'login' })
        break
      case e.response && e.response.status <= 500:
        router.push({ name: 'page-error-500' })
        break
      case String(e).includes('Network Error'):
        router.push({ name: 'page-network-error' })
        break
      default: console.log(e)
    }
  },
  onBeforeRefresh: () => setRefreshLoader(true),
  onAfterRefresh: () => setRefreshLoader(false)
})

export default auth
