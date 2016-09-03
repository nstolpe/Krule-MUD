'use strict'

let readline = require('readline'),
	socketio = require('socket.io-client'),
	util = require('util'),
	color = require('ansi-color').set

let nick,
	socket = socketio.connect('http://localhost:3000'),
	rl = readline.createInterface(process.stdin, process.stdout)

rl.question('Please enter a nickname: ', function(name) {
	nick = name;
	let msg = nick + " has joined"
	socket.emit('send', { type: 'notice', message: msg })
	rl.prompt(true)
})

rl.on('line', function(line) {
	if (line[0] == '/' && line.length > 1) {
		let cmd = line.match(/[a-z]+\b/)[0],
		arg = line.substr(cmd.length + 2, line.length)
		chatCommand(cmd, arg)
	} else {
		socket.emit('send', { type: 'chat', message: line, nick: nick })
		rl.prompt(true)
	}
})

socket.on('message', function(data) {
	let leader
	print(data)
	if (data.type == 'chat' && data.nick != nick) {
		leader = color('<' + data.nick + '>', 'green')
		print(leader + data.message)
	} else if (data.type == 'notice') {
		print(data.messae, 'cyan')
	} else if (data.type == 'tell' && data.to == nick) {
		leader = color('[' + data.from + '->' + data.to + ']', 'red')
		print(leader + data.message)
	} else if (data.type == 'emote') {
		print(color(data.message, 'cyan'))
	}
})
function chatCommand(cmd, arg) {
	switch (cmd) {
		case 'nick':
			let notice = nick + " changed their name to " + arg
			nick = arg
			socket.emit('send', { type: 'notice', message: notice })
			rl.prompt(true)
			break;
		case 'msg':
			let to = arg.match(/[a-z]+\b/)[0],
				message = arg.substr(to.length, arg.length)
			socket.emit('send', { type: 'tell', message: message, to: to, from: nick })
			rl.prompt(true)
			break;
		case 'me':
			let emote = nick + ' ' + arg
			socket.emit('send', { type: 'emote', message: emote })
			rl.prompt(true)
			break;
		default:
			print('invalid command')
	}
}

function print(msg) {
	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	console.log(msg)
	rl.prompt(true)
}
