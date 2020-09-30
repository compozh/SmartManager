import { hubConnection } from 'signalr-no-jquery'
import auth from '@/utils/auth'

export default {
  data: () => ({
    signalRConnection: null
  }),
  beforeDestroy () {
    this.stopSignalRConnection()
  },
  methods: {
    async startSignalRConnection () {
      const url = window.appConfig.SignalRUrl
      const hubName = 'messagehub'
      const connection = this.signalRConnection = hubConnection(url, {
        logging: true,
        useDefaultPath: false
      })

      const hubProxy = connection.createHubProxy(hubName)
      hubProxy.on('receiveMessage', message => {
        const parsedMessage = JSON.parse(message)
        if (parsedMessage.TASKID) {
          this.getFolders()
        }
        if (parsedMessage.MODE === 'Add') {
          // Re-reading tasks to view new tasks
          this.getTasks(this.activeFolderId)
        }
      })

      const subscribeFunc = () => {
        const appName = 'SMARTMANAGER'
        const token = auth._getRefreshToken()
        const args = [appName, token]
        connection.send({ H: hubName, M: 'Subscribe', A: args, I: 0 })
      }

      connection.reconnected(() => subscribeFunc)

      connection.start({ withCredentials: false })
        .done(subscribeFunc)
        .fail(() => console.error('SignalR not connected'))
    },
    stopSignalRConnection () {
      if (this.signalRConnection) {
        this.signalRConnection.stop()
      }
    }
  }
}
