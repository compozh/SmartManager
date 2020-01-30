import { HubConnectionBuilder } from '@microsoft/signalr'

export default class IotSignalRService {
    constructor(thingId) {
        this.thingId = thingId
        this.isConnected = false
    }

    connect(url) {
        this.connection = new HubConnectionBuilder()
		.withUrl(url)
		.withAutomaticReconnect()
		.build()

        this.connection.start({ withCredentials: false }).then(() => {
            this.isConnected = true
            this.connection
                .invoke("Enter", this.thingId)
                .catch(err => console.error(err.toString()))
        })

        this.connection.onreconnecting(error => {
            console.log(error)
        })
    }

    get connected() {
        return this.isConnected
    }

    set connected(value) {
        this.isConnected = value
    }

	sendMessage({ eventName, message }) {
		this.connection
			.invoke("Send", eventName, message, this.thingId)
			.catch(err => console.error(err.toString()))
    }
    
	sendMessageToAll({ eventName, message }) {
		this.connection
			.invoke("SendToAll", eventName, message)
			.catch(err => console.error(err.toString()))
    }
    
	onRecieveMessage({ eventName, callback }) {
		this.connection.on(eventName, callback)
    }
    
	offRecieveMessage({ eventName, callback }) {
		this.connection.off(eventName, callback)
    }
    
	async dispose(thingId) {
		await this.connection
			.invoke("RemoveFromGroup", thingId)
			.catch(err => console.error(err.toString()))
			.then(() => {
                this.connection.stop()
                this.isConnected = false
            })
	}
}