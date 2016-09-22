'use strict';
const WebSocket = require('ws');
const Turms = require('./turms');

module.exports = function() {
	return {
		Socket: function(Hub) {
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
				}
			};

			Object.assign(socket, Turms.Subscriber(Hub));

			Hub.addSubscription(socket, 'connect', (message) => {
				socket.connect(message.data.server, message.data.port);
			});
			return socket;
		}
	}
}
// function Socket() {
// 	constructor(Vorpal) {
// 		_Vorpal.set(this, Vorpal);
// 		this.waitingForConnection = false;
// 		this.server;
// 		this.port;
// 	}
// 	/**
// 	 * Connects to http://<server>:<port>
// 	 */
// 	connect(server, port) {
// 		let ws,
// 			Vorpal = _Vorpal.get(this),
// 			message,
// 			_self = this;
//
// 		ws = new WebSocket('http://' + server + ':' + port);
//
// 		ws.on('open', function() {
// 			this.server = server;
// 			this.port = port;
// 			Vorpal.log(Vorpal.chalk.green('Connected to %s on port %s.'), server, port);
// 			_ws.set(this, ws);
// 			this.waitingForConnection = true;
// 		});
//
// 		// @TODO log the actual error somewhere.
// 		ws.on('error', function(err) {
// 			Vorpal.log(Vorpal.chalk.red('Failed to connect to %s on port %s'), server, port);
// 			// return { type: 'ERROR', message: Vorpal.chalk.red('Connection to server failed') };
// 		});
//
// 		ws.on('message', function(msg) {
// 			message = _self.parseMessage(msg);
// 			Vorpal.log(message);
// 		});
// 	}
//
// 	disconnect() {
//
// 	}
// 	/**
// 	 * Returns private property _ws
// 	 */
// 	ws() {
// 		return _ws.get(this);
// 	}
// 	/**
// 	 * Returns private property _Vorpal
// 	 */
// 	Vorpal() {
// 		return _Vorpal.get(this);
// 	}
// 	/**
// 	 * Checks objects for different keys
// 	 */
// 	difference(a, b) {
// 		let x = new Set(a),
// 			y = new Set(b);
// 		return Array.from( new Set([...x].filter( f => !y.has(x) )) );
// 	}
// 	/**
// 	 * Parses an incoming JSON message. Throws an error
// 	 * @TODO define message properties somewhere more global.
// 	 */
// 	parseMessage(message) {
// 		let parsedMessage,
// 			properties = ['type', 'message'];
//
// 		try {
// 			parsedMessage = JSON.parse(message);
//
// 			if (this.difference(Object.keys(parsedMessage), properties).size)
// 				throw new Error('Received JSON but it had the wrong keys.');
// 		} catch(err) {
// 			// @TODO log(e)
// 			// _Vorpal.get(this).log(err);
// 			parsedMessage = {
// 				type: 'ERROR',
// 				message: 'Bad response from server.'
// 			}
// 		}
//
// 		return parsedMessage;
// 	}
// }
