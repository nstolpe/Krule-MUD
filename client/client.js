'use strict'
require('./cli');
const Hermes = require('./hermes');
const Vorpal = require('vorpal')();
const Hub = Hermes.Hub();
const Socket = require('./socket')().Socket(Hub);

Object.assign(Vorpal, Hermes.Receiver())
Hub.addSubscription(Vorpal, 'server-connection-opened', (message) => Vorpal.log(message.data));

Vorpal.use(require('./commands'));

Vorpal.exec('clear').then(function(data) {
	Vorpal.log('Welcome to the Krule-MUD client.');
	Vorpal.log('You are not connected to a server, your options are limited (type `help` if you\'re stuck)');
	// Socket.sendMessage(Hermes.Message({data: {a: 'l', c:'p'}}));
});

Vorpal.delimiter('Krule-MUD >>').show();
