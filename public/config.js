window.devMode = false
const DM = window.DOCKERMODE
window.appConfig = {
  BASE_URL: window.VUE_APP_BASE_PATH,
  GqlUrl: DM ? '*GRAPHQLURL*' : (window.devMode ? 'http://localhost:5002/' : 'https://m.it.ua/GraphQlServer/'),
  WsUrl: DM ? '*WEBSERVICEURL*' : 'https://m.it.ua/ws/',
  SignalRUrl: DM ? '*SIGNALRURL*' : 'https://m.it.ua/ws/signalr/hubs',
  SiteUrl: DM ? '*SITEURL*' : 'https://m.it.ua',
  iconset: DM ? '*ICONSET*' : '',
  lang: DM ? '*LANG*' : '',
  rtl: DM ? '*RTL*' : false,
  oidc: {
    authority: 'https://smartid.smarttender.biz/login/',
    client: 'smartmanager.fb02fc7e-b33e-47a8-8ce3-c3ad9a986d66',
    addScope: 'itenterprise.ws'
  }
}
