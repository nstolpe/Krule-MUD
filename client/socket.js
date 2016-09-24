'use strict';
const WebSocket = require('ws');
const Turms = require('./turms');

const addSubscriptions = function(socket, Hub) {
	Hub.addSubscription(socket, 'connect', (message) => {
		socket.connect(message.data.server, message.data.port);
	});

	Hub.addSubscription(socket, 'disconnect', (message) => {
		socket.disconnect();
	});
}

module.exports = function(Hub) {
	let socket = {
		ws: null,
		server: null,
		port: null,
		connect: function(server, port) {
			let ws = new WebSocket('ws://' + server + ':' + port);
			ws.on('open', () => {
				this.server = server;
				this.port = port;
				// this.sendMessage(Turms.Message({
				// 	type: 'server-connection-opened',
				// 	data: { port: port, server: server }
				// }));
				this.ws = ws;
			});
			ws.on('error', function(err) {
				console.log(err);
				// send message, failed to connect
			});
			ws.on('message', function(msg) {

			});
		},
		disconnect: function() {
			this.ws.close();
		}
	};

	Object.assign(socket, Turms.Subscriber());

	addSubscriptions(socket, Hub);

	return socket;
}
