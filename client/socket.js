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
			Vorpal = _Vorpal.get(this);

		ws = new WebSocket('http://' + server + ':' + port);

		ws.on('error', function(err) {
			// Vorpal.log(err);
			return Vorpal.log(Vorpal.chalk.red('Connection to server failed'));
		});
		Vorpal.log(Vorpal.chalk.green('Connected to %s on port %s.'), server, port)
		_ws.set(this, ws);

		let _self = this;

		ws.on('message', function(msg) {
			let message = _self.parseMessage(msg);
			_self.handleMessage(message);
		});
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
	difference(a, b) {
		let x = new Set(a),
			y = new Set(b);
		return Array.from( new Set([...x].filter( f => !y.has(x) )) );
	}
	/**
	 * Parses an incoming JSON message. Throws an error
	 * @TODO if event.data passes JSON.parse(), check if it's a valid message
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
	handleMessage(message) {
		let Vorpal = _Vorpal.get(this);
		switch(message.type) {
			case 'PROMPT':
				Vorpal.log(Vorpal.chalk.yellow(message.message));
				break;
			case 'ERROR':
				Vorpal.log(Vorpal.chalk.red(message.message));
				break;
		}
	}
}

module.exports = function(Vorpal) {
	Vorpal.Socket = new Socket(Vorpal);
}
