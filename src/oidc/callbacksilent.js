import Oidc from 'oidc-client'

Oidc.Log.logger = console
Oidc.Log.level = Oidc.Log.INFO
new Oidc.UserManager().signinSilentCallback()
  .catch((err) => {
    console.warn('[OIDC CALLBACK]', err)
  })
