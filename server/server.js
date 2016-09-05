'use strict'
const app = require('http').createServer()
const io = require('socket.io')(app);
const program = require('commander');

require('pkginfo')(module, 'version');
const version = module.exports.version;

const users = [];
const sockets = [];

const Models = {
	User: function(socket) {
		var _socket = socket;
		var _name;
		this.setName = function(name) {
			_socket = socket;
		}
	}
}

program
	.version(version)
	.option('-p, --port [port]', 'Port to serve from. Optional, defaults to 1138.', 1138)
	.parse(process.argv);

io.on('connection', function(socket) {
	let user = new Models.User(socket);
	users.push(user);
	sockets.push(socket);
	console.log('Socket ' + socket.conn.id + ' has connected');
	io.on('send', function(data) {
		console.log(data);
		io.emit('message', data);
	})
});

app.listen(program.port);
console.log('listening on ' + program.port);
