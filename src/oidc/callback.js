import Oidc from 'oidc-client'
import auth from '@it-enterprise/jwtauthentication'

Oidc.Log.logger = console
Oidc.Log.level = Oidc.Log.INFO
new Oidc.UserManager({ response_mode: 'query' }).signinRedirectCallback()
  .then(function (req) {
    if (req.profile && req.access_token) {
      auth.config({ baseUrl: window.appConfig.GqlUrl })
      auth.loginByOidcRedirectComplite(req.access_token)
    }
    window.location.href = req.state && req.state.returnUrl
      ? req.state.returnUrl
      : `${window.location.origin}${window.appConfig.BASE_URL}`
  })
  .catch(function (err) {
    console.warn('[OIDC CALLBACK]', err)
    window.location.href = `${window.location.origin}${window.appConfig.BASE_URL}`
  })
