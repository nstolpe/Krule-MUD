'use strict'
const program = require('commander');

require('pkginfo')(module, 'version');
const version = module.exports.version;

const users = [];
const sockets = [];

class User {
	constructor(ws, name) {
		this.ws = ws;
		this.name = name;
	}
}

program
	.version(version)
	.option('-p, --port [port]', 'Port to serve from. Optional, defaults to 1138.', 1138)
	.parse(process.argv);

const WebSocketServer = require('ws').Server,
	wss = new WebSocketServer( { port: program.port });

wss.on('connection', function(ws) {
	// let user = new User(ws);
	// users.push(user);
	sockets.push(ws);
	ws.send(JSON.stringify({ type: 'PROMPT', message: 'Please enter your name' }));

	ws.on('message', function(msg) {
		console.log(msg);
	})

	// console.log(ws);
	console.log('new socket @%s', ws._socket.remoteAddress);
	// ws.on('send', function(data) {
	// 	console.log(data);
	// 	ws.emit('message', data);
	// })
});


console.log('listening on ' + program.port);
