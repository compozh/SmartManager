const prodMode = process.env.NODE_ENV === 'production';
export default {
  GrapgQlUrl: prodMode ? process.env.VUE_APP_GRAPHQL_PATH : 'http://localhost:15504/',
  BaseUrl: process.env.VUE_APP_BASE_PATH,
  WsUrl: prodMode ? process.env.VUE_APP_WS_PATH : 'http://localhost:64137/ws/api/',
  SignalRUrl: process.env.VUE_APP_SIGNALR_PATH
};