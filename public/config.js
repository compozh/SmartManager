window.devMode = false
const DM = window.DOCKERMODE
window.appConfig = {
  GrapgQlUrl: DM ? '*GRAPHQLURL*' : (window.devMode ? 'http://localhost:5002/' : 'https://m.it.ua/GraphQlServer/'),
  BASE_URL: window.VUE_APP_BASE_PATH,
  WsUrl: window.devMode ? 'http://localhost:64137/ws/api/' : '/ws/api/',
  SignalRUrl: DM ? '*SIGNALRURL*' : 'https://m.it.ua/ws/signalr/hubs'
}
