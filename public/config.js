window.devMode = false
const DM = window.DOCKERMODE
window.appConfig = {
  GrapgQlUrl: DM ? '*GRAPHQLURL*' : (window.devMode ? 'http://localhost:5000/' : 'https://m.it.ua/GraphQlServer/'),
  BASE_URL: window.VUE_APP_BASE_PATH,
  WsUrl: window.devMode ? 'http://localhost:64137/ws' : '/ws',
  SignalRUrl: DM ? '*SIGNALRURL*' : 'https://m.it.ua/ws/signalr/hubs'
}
