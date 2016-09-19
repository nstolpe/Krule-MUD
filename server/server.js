'use strict'

require('pkginfo')(module, 'version');
const version = module.exports.version;
const program = require('commander');
const util = require('util');
const WebSocketServer = require('ws').Server;

const users = [];
const sockets = [];

function User(ws, name) {
	return {
		ws: ws,
		name: name
	}
}

program
	.version(version)
	.option('-p, --port [port]', 'Port to serve from. Optional, defaults to 1138.', 1138)
	.parse(process.argv);


const wss = new WebSocketServer( { port: program.port });

wss.on('connection', function(ws) {
	// let user = User(ws);
	// users.push(user);
	sockets.push(ws);
	ws.send(JSON.stringify({
		type: 'connected',
		data: {
			message: util.format('Connection established on %s:%s', program.server, program.port)
		}
	}));

	ws.on('message', function(msg) {
		console.log(msg);
	})

	// console.log(ws);
	console.log('new socket connection from %s', ws._socket.remoteAddress);
	ws.on('send', function(data) {
		// console.log(data);
		ws.emit('message', data);
	})
	ws.on('close', function(e) {
		// console.log(e);
		console.log('socket disconnecting');
	});
});


console.log('listening on ' + program.port);
