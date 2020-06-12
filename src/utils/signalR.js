import { hubConnection } from 'signalr-no-jquery'
import auth from '@/utils/auth'

const url = window.appConfig.SignalRUrl
const hubName = 'messagehub'
const appName = 'SMARTMANAGER'
let ticket = ''
auth.getToken().then(token => { ticket = token })

const connection = hubConnection(url, {
  logging: true,
  useDefaultPath: false
})

const hubProxy = connection.createHubProxy(hubName)

hubProxy.on('receiveMessage', async message => {
  console.log(message)
})

const subscribeFunc = (app, ticket) => {
  const args = [app]
  if (ticket) {
    args.push(ticket)
  }
  connection.send({ H: hubName, M: 'Subscribe', A: args, I: 0 })
}

connection.reconnected(() => subscribeFunc(appName, ticket))

connection.start({ withCredentials: false })
  .done(() => subscribeFunc(appName, ticket))
  .fail(() => console.error('SignalR not connected'))
