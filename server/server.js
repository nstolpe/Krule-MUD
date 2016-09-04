'use strict'

const http = require('http');
const socketIO = require('socket.io');
const program = require('commander');

require('pkginfo')(module, 'version');
const version = module.exports.version;

program
	.version(version)
	.option('-p, --port [port]', 'port to serve from', 1800)
	.parse(process.argv);

const server = http.createServer();
const io = socketIO(server);

io.sockets.on('connection', function(socket) {
	console.log('connection');
	socket.on('send', function(data) {
		console.log(data);
		io.sockets.emit('message', data);
	})
});

server.listen(program.port);
console.log('listening on ' + program.port);
