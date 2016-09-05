'use strict';
const WebSocket = require('ws');
const _ws = new WeakMap();
const _Vorpal = new WeakMap();

class Socket {
	constructor(Vorpal) {
		_Vorpal.set(this, Vorpal);
	}
	connect(server, port) {
		let ws = new WebSocket('http://' + server + ':' + port);

		_ws.set(this, ws);

		let self = this;

		ws.onmessage = function(event) {
			let message
			try {
				message = JSON.parse(event.data);
				self.receiveMessage(message);
			} catch(e) {
				// _Vorpal.get(this).log(e);
				return _Vorpal.get(this).log(Vorpal.chalk.red('Something went wrong between the server and here.'));
			}
		};
	}
	ws() {
		return _ws.get(this);
	}
	receiveMessage(message) {
		_Vorpal.get(this).log(message);
		switch(message.type) {
			case 'PROMPT':
				break;
		}
	}
}

module.exports = function(Vorpal) {
	Vorpal.Socket = new Socket(Vorpal);
}
