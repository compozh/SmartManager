import Oidc from 'oidc-client'

Oidc.Log.logger = console
Oidc.Log.level = Oidc.Log.INFO
new Oidc.UserManager().signoutRedirectCallback()
  .then(req => {
    window.location.href = req.state && req.state.returnUrl
      ? req.state.returnUrl
      : `${window.location.origin}${window.appConfig.BASE_URL}`
  })
  .catch((err) => {
    console.warn('[OIDC CALLBACK]', err)
    window.location.href = `${window.location.origin}${window.appConfig.BASE_URL}`
  })
