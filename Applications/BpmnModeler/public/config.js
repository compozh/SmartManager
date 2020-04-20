window.devMode = false;
window.config = {
  GrapgQlUrl: window.devMode ? 'http://localhost:15504/' : 'https://m.it.ua/GraphQlServer/',
  BaseUrl: window.VUE_APP_BASE_PATH,
  WsUrl: window.devMode ? 'http://localhost:64137/ws/api/' : '/ws/api/',
  SignalRUrl: 'https://m.it.ua/ws/signalr/hubs'
};