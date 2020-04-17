import auth from '@it-enterprise/jwtauthentication'
import router from '@/router'

// Authentication configuration
auth.config({
  baseUrl: window.appConfig.GrapgQlUrl,
  onError: e => {
    console.log('', e.response.status, e.response.status === 400)
    switch (true) {
      case e.response && e.response.status === 400:
        router.push({name: 'login'})
        break
      case e.response && e.response.status <= 500:
        router.push({name: 'page-error-500'})
        break
      default: console.log(e)
    }
  }
})

export default auth
