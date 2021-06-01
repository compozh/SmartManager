import { hubConnection } from 'signalr-no-jquery'
import auth from '@/utils/auth'
import { signalRConnect } from './newSignalRConnect'

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
      const appName = 'SMARTMANAGER'
      const token = auth._getRefreshToken()
      const hubProxy = connection.createHubProxy(hubName)
      const onReceive = receivedMessage => {
        const message = JSON.parse(receivedMessage)

        if (message.TASKID) {
          this.getFolders()
        }

        if (message.MODE === 'Add') {
          // Re-reading tasks to view new tasks
          this.getTasks(this.activeFolderId)
        }

        if (message.MODE === 'AddComment') {
          // Re-reading comments
          // Action needs additional params (type & id)
          // this.$store.dispatch('getComments')
        }

        if (message.MODE === 'TASK_SUBTASKS_CHANGED') {
          this.getTask()
        }

        if (message.MODE === 'ChangeStatus') {
          console.log('Status changed', message.TASKID)
          // TODO: Добавить обработку изменения статуса
        }
      }
      hubProxy.on('receiveMessage', onReceive)

      const subscribeFunc = () => {
        const args = [appName, token]
        connection.send({ H: hubName, M: 'Subscribe', A: args, I: 0 })
      }

      connection.reconnected(() => subscribeFunc)

      connection.start({ withCredentials: false })
        .done(subscribeFunc)
        .fail(() => {
          console.error('Old SignalR not connected')
          signalRConnect(appName, url, onReceive, token)
        })
    },
    stopSignalRConnection () {
      if (this.signalRConnection) {
        this.signalRConnection.stop()
      }
    }
  }
}
