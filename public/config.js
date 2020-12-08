window.devMode = false
const DM = window.DOCKERMODE
window.appConfig = {
  GrapgQlUrl: DM ? '*GRAPHQLURL*' : (window.devMode ? 'http://localhost:5002/' : 'https://m.it.ua/GraphQlServer/'),
  BASE_URL: window.VUE_APP_BASE_PATH,
  WsUrl: DM ? '*WEBSERVICEURL*' : (window.devMode ? 'http://localhost:64137/ws' : '/ws'),
  SignalRUrl: DM ? '*SIGNALRURL*' : 'https://m.it.ua/ws/signalr/hubs',
  SiteUrl: DM ? '*SITEURL*' : 'https://m.it.ua'
}

if (!window.appConfig.WsUrl) {
  window.appConfig.WsUrl = '/ws'
}
