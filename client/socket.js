'use strict';
const WebSocket = require('ws');
const _ws = new WeakMap();
const _Vorpal = new WeakMap();

class Socket {
	constructor(Vorpal) {
		_Vorpal.set(this, Vorpal);
	}
	/**
	 * Connects to http://<server>:<port>
	 */
	connect(server, port) {
		let ws,
			Vorpal = _Vorpal.get(this),
			message,
			_self = this;

		ws = new WebSocket('http://' + server + ':' + port);

		ws.on('open', function() {
			Vorpal.log(Vorpal.chalk.green('Connected to %s on port %s.'), server, port);
			ws.send(JSON.stringify({ type: 'NEW_CONNECTION', message: 'New connection' }));
			_ws.set(this, ws);
			// Vorpal.exec('second');
		});

		// @TODO log the actual error somewhere.
		ws.on('error', function(err) {
			Vorpal.log(Vorpal.chalk.red('Failed to connect to %s on port %s'), server, port);
			// return { type: 'ERROR', message: Vorpal.chalk.red('Connection to server failed') };
		});

		// ws.on('message', function(msg) {
		// 	message = _self.parseMessage(msg);
		// 	Vorpal.log(message);
		// });
	}

	disconnect() {

	}
	/**
	 * Returns private property _ws
	 */
	ws() {
		return _ws.get(this);
	}
	/**
	 * Returns private property _Vorpal
	 */
	Vorpal() {
		return _Vorpal.get(this);
	}
	/**
	 * Checks objects for different keys
	 */
	difference(a, b) {
		let x = new Set(a),
			y = new Set(b);
		return Array.from( new Set([...x].filter( f => !y.has(x) )) );
	}
	/**
	 * Parses an incoming JSON message. Throws an error
	 * @TODO define message properties somewhere more global.
	 */
	parseMessage(message) {
		let parsedMessage,
			properties = ['type', 'message'];

		try {
			parsedMessage = JSON.parse(message);

			if (this.difference(Object.keys(parsedMessage), properties).size)
				throw new Error('Received JSON but it had the wrong keys.');
		} catch(err) {
			// @TODO log(e)
			// _Vorpal.get(this).log(err);
			parsedMessage = {
				type: 'ERROR',
				message: 'Bad response from server.'
			}
		}

		return parsedMessage;
	}
}

module.exports = function(Vorpal) {
	Vorpal.Socket = new Socket(Vorpal);
}
