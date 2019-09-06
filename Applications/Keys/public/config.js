window.appConfig = {
  GrapgQlUrl: window.devMode ? 'http://localhost:5002/' : '/GraphQlServer/',
  BASE_URL: window.VUE_APP_BASE_PATH,
  WsUrl: window.devMode ? 'http://localhost:64137/ws/api/' : '/ws/api/',
  SignalRUrl: 'https://m.it.ua/ws/signalr/hubs'
}
