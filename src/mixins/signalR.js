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
      // eslint-disable-next-line no-return-await
      // const token = async () => '6F88DE61-4BBE-4E54-8B7F-5237A65C23AA' // await auth._getRefreshToken()
      const connection = this.signalRConnection = hubConnection(url, {
        logging: true,
        useDefaultPath: false
      })

      const hubProxy = connection.createHubProxy(hubName)
      hubProxy.on('receiveMessage', message => {
        const parsedMessage = JSON.parse(message)
        !parsedMessage.TASKID || this.getTasks(this.activeFolderId)
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
