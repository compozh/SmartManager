import auth from '@/utils/auth'
import router from '@/router'

export default {
  auth,
  WsUrl: window.appConfig.WsUrl,
  routerDependencies: () => ({ router }),
  GraphQlUrl: window.appConfig.GrapgQlUrl
}
