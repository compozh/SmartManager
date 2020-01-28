import Oidc from 'oidc-client';

var mgr = new Oidc.UserManager({ userStore: new Oidc.WebStorageStateStore(), loadUserInfo: true, filterProtocolClaims: true, response_mode: 'query' });


mgr.signoutRedirectCallback().then(function () {
    window.location.href = 'index.html';
}).catch(function (err) {
    console.log(err);
});
