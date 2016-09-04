'use strict'
const vorpal = require('vorpal')();
require('pkginfo')(module, 'version');
const version = module.exports.version;
const socketIO = require('socket.io-client');

var socket;

vorpal
	.command('connect')
	.option('-h, --host <host>', 'The host')
	.description('Connects to a MUD server.\n[server] defaults to \'localhost\'\n[port] defaults to 1138\n')
	.action(function(args, cb) {
		this.log(args);
		let cs = 'http://' + (args.options.host || 'localhost') + ':' + (args.options.port || 1138);

		this.log(cs)

		socket = socketIO.connect(cs);
		cb();
	});

vorpal
	.command('clear', 'Clears the screen.\n')
	.action(function(args, cb) {
		let blank = '';
		for (let i = 0, l = process.stdout.rows; i < l; i++) blank += '\n';

		vorpal.ui.redraw(blank);
		vorpal.ui.redraw.clear();
		vorpal.ui.redraw.done();

		cb();
	});

vorpal.exec('clear').then(function(data) {
	vorpal.log('Welcome to krule-MUD');
	vorpal.log('You have not connected to a server yet, your options are limited (type help if you\'re stuck)');
})


vorpal.delimiter('krule-MUD >>').show();
// let readline = require('readline'),
// 	socketio = require('socket.io-client'),
// 	util = require('util'),
// 	color = require('ansi-color').set;
//
// let nick,
// 	socket = socketio.connect('http://localhost:3000'),
// 	rl = readline.createInterface(process.stdin, process.stdout);
//
// rl.question('Please enter a nickname: ', function(name) {
// 	nick = name;
// 	let msg = nick + " has joined";
// 	socket.emit('send', { type: 'notice', message: msg });
// 	rl.prompt(true);
// })
//
// rl.on('line', function(line) {
// 	if (line[0] == '/' && line.length > 1) {
// 		let cmd = line.match(/[a-z]+\b/)[0],
// 		arg = line.substr(cmd.length + 2, line.length)
// 		chatCommand(cmd, arg);
// 	} else {
// 		socket.emit('send', { type: 'chat', message: line, nick: nick });
// 		rl.prompt(true);
// 	}
// })
//
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
//
// function print(msg) {
// 	process.stdout.clearLine();
// 	process.stdout.cursorTo(0);
// 	console.log(msg);
// 	rl.prompt(true);
// }
