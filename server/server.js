'use strict'

require('pkginfo')(module, 'version');
const version = module.exports.version;
const program = require('commander');
const util = require('util');
const WebSocketServer = require('ws').Server;

const users = [];
const clients = [];

function Client({ options }) {
	return {
		socket: options.socket,
		name: options.name
	}
}

program
	.version(version)
	.option('-p, --port <port>', 'Port to serve from. If not passed, defaults to 1138.', 1138)
	.option('-s, --server <server>', 'The name of your server.')
	.parse(process.argv);

// check for required name flag/option pair.
if (!program.server) {
	console.error("  error: `-s, --server <server>' argument missing");
	process.exit(1);
}

const wss = new WebSocketServer( { port: program.port });

wss.on('connection', function(ws) {
	let client = Client({ socket: ws });
	clients.push(client);

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

console.log("krule-MUD server '%s' started.\nServer listening on %s", program.server, program.port);
