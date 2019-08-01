import { hubConnection } from 'signalr-no-jquery';


export default {
  install(Vue){
    Vue.prototype.$signalR = {
      connect
    }
  }
}


function connect(app, url, onReceive, ticket){

  let connection = hubConnection(url, {
    logging:true,
    useDefaultPath:false
  });
  const hubName = "messagehub";

  const hubProxy = connection.createHubProxy(hubName);

  // set up event listeners i.e. for incoming "message" event
  hubProxy.on('receiveMessage', function(message) {
    onReceive(message);
  });

	var subscribeFunc = function(app, ticket) {
    var args = [app]
    if(ticket){
      args.push(ticket)
    }
    connection.send({H : hubName, M : "Subscribe", A : args, I : 0})
	}

	connection.reconnected(function() {
		subscribeFunc(app, ticket);
	});

	connection.start({ withCredentials: false }).done(function() {
		subscribeFunc(app, ticket);
  });

}
