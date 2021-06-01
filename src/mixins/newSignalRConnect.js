const signalR = require('@microsoft/signalr')

export function signalRConnect (app, url, onReceive, ticket) {
  try {
    var connection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(signalR.LogLevel.Information)
      .build()
    var start = function () {
      connection.start().then(function () {
        subscribeFunc(app, ticket)
        console.log('New SignalR Connected.')
      })
    }
    connection.on('ReceiveMessage', function (message) {
      var div = document.createElement('div')
      div.innerText = message
      var encodedMsg = div.innerHTML
      onReceive(encodedMsg)
    })

    connection.onclose(start)
    var subscribeFunc = function (app, ticket) {
      connection.invoke('Subscribe', app, ticket)
    }
    start()
  } catch (err) {
    console.log(err)
  }
}
