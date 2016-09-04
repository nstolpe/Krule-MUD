'use strict'
const app = require('http').createServer()
const io = require('socket.io')(app);
const program = require('commander');

require('pkginfo')(module, 'version');
const version = module.exports.version;

const users = {}

const Models = {
	User: function(socket) {
		this.socket = socket;
	}
}

program
	.version(version)
	.option('-p, --port [port]', 'Port to serve from. Optional, defaults to 1138.', 1138)
	.parse(process.argv);

io.on('connection', function(socket) {
	console.log('foo');
	io.on('send', function(data) {
		console.log(data);
		io.emit('message', data);
	})
});

app.listen(program.port);
console.log('listening on ' + program.port);
