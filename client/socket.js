'use strict';
let client = require('socket.io-client');
let _socket = new WeakMap();

class Socket {
	constructor(options) {
	}
	connect(server, port) {
		let socket = client.connect('http://' + server + ':' + port);
		_socket.set(this, socket);
	}
	socket() {
		return _socket.get(this);
	}
}

module.exports = function() {
	return new Socket();
}
