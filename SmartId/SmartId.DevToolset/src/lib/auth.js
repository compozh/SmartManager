import Oidc from 'oidc-client';

//var apppath = '/smartidcur/tools';
var apppath = '';
var mgr = new Oidc.UserManager({
    userStore: new Oidc.WebStorageStateStore(),
    //authority: 'https://m.it.ua/smartidcur',
    authority: 'https://localhost:44319/',
    client_id: 'local-dev-pkce',
    redirect_uri: window.location.origin + apppath + '/callback.html',
    response_type: 'code',
    scope: 'openid profile',
    post_logout_redirect_uri: window.location.origin + apppath + '/callbacksignout.html',
    silent_redirect_uri: window.location.origin + apppath + '/callbackrenew.html',
    accessTokenExpiringNotificationTime: 10,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true
})

let reactive = {
};

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

mgr.events.addUserLoaded(function (user) {
    console.log('New User Loaded?', arguments);
    console.log('Acess_token: ', user.access_token)
    if (reactive.signin) {
        reactive.signin(true);
    }
});

mgr.events.addUserSignedOut(function () {
    console.log('UserSignedOut?', arguments);
    mgr.signoutRedirect().then(function (resp) {
        console.log('signed out', resp);
    }).catch(function (err) {
        console.log(err)
    })
});

mgr.events.addAccessTokenExpiring(function () {
    console.log('AccessToken Expiring?', arguments);
});

mgr.events.addAccessTokenExpired(function () {
    console.log('AccessToken Expired?', arguments);
    alert('Session expired. Going out!');
    mgr.signoutRedirect().then(function (resp) {
        console.log('signed out', resp);
    }).catch(function (err) {
        console.log(err)
    })
});

mgr.events.addSilentRenewError(function () {
    console.error('Silent Renew Error?', arguments);
});

export default class Auth {
    setReactiveCallback(signinCallback) {
        if (!reactive.signin) {
            reactive.signin = signinCallback;
        }
    }
    // Renew the token manually
    renewToken(silentMode) {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.signinSilent().then(function (user) {
                if (user == null) {
                    self.signIn(null)
                } else {
                    return resolve(user)
                }
            }).catch(function (err) {
                console.log(err)
                if (silentMode) {
                    return resolve(null)
                }
                return reject(err)
            });
        })
    }

    // Get the user who is logged in
    getUser() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Check if there is any user logged in
    getSignedIn() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(false)
                } else {
                    return resolve(true)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Redirect of the current window to the authorization endpoint.
    signIn() {
        mgr.signinPopup({ state: 'some data' }).catch(function (err) {
            console.log(err)
        })
    }

    // Redirect of the current window to the end session endpoint
    signOut() {
        if (reactive.signin) {
            reactive.signin(false);
        }
        mgr.signoutRedirect({ state: 'some data' }).then(function (resp) {
            console.log('signed out', resp);
        }).catch(function (err) {
            console.log(err)
        })
    }

    // Get the profile of the user logged in
    getProfile() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.profile)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the token id
    getIdToken() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.id_token)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the session state
    getSessionState() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.session_state)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the access token of the logged in user
    getAcessToken() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.access_token)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Takes the scopes of the logged in user
    getScopes() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.scopes)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }
}