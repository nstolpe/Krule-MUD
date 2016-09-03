'use strict'

let socketio = require('socket.io')

var io = socketio.listen(3000)
console.log('listening on 3000')
io.sockets.on('connection', function(socket) {
	console.log('connection')
	socket.on('send', function(data) {
		console.log(data)
		io.sockets.emit('message', data)
	})
})
