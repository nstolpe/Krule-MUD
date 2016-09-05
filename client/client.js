'use strict'
const Vorpal = require('vorpal')();
require('pkginfo')(module, 'version');
const version = module.exports.version;
const socketIO = require('socket.io-client');
const program = require('commander');

Vorpal.Socket = require('./socket')();
// var socket;

program
	.version(version)
	.usage('[options] Launches a krule-MUD terminal. If [server] is passed an attempt will be made to connect automatically.')
	.option('-s, --server [server]', 'The host to connect to. Defaults to `localhost` when passed without value.')
	.option('-p, --port [port]', 'The port to connect to on [server]. Requires [server]. Defaults to `1138` when passed with not value or when [server] is passed without [port].')
	.parse(process.argv);

Vorpal.use(require('./commands'));

Vorpal.exec('clear').then(function(data) {
	Vorpal.log('Welcome to the krule-MUD client.');
	Vorpal.log('You are not connected to a server, your options are limited (type `help` if you\'re stuck)');
})

Vorpal.delimiter('krule-MUD >>').show();
// socket.on('message', function(data) {
// 	let leader;
//
// 	if (data.type == 'chat' && data.nick != nick) {
// 		leader = color('<' + data.nick + '>', 'green');
// 		print(leader + data.message);
// 	} else if (data.type == 'notice') {
// 		print(data.messae, 'cyan');
// 	} else if (data.type == 'tell' && data.to == nick) {
// 		leader = color('[' + data.from + '->' + data.to + ']', 'red');
// 		print(leader + data.message);
// 	} else if (data.type == 'emote') {
// 		print(color(data.message, 'cyan'));
// 	}
// })
// function chatCommand(cmd, arg) {
// 	switch (cmd) {
// 		case 'nick':
// 			let notice = nick + " changed their name to " + arg;
// 			nick = arg;
// 			socket.emit('send', { type: 'notice', message: notice });
// 			rl.prompt(true);
// 			break;
// 		case 'msg':
// 			let to = arg.match(/[a-z]+\b/)[0],
// 				message = arg.substr(to.length, arg.length);
// 			socket.emit('send', { type: 'tell', message: message, to: to, from: nick });
// 			rl.prompt(true);
// 			break;
// 		case 'me':
// 			let emote = nick + ' ' + arg;
// 			socket.emit('send', { type: 'emote', message: emote });
// 			rl.prompt(true);
// 			break;
// 		default:
// 			print('invalid command');
// 	}
// }
