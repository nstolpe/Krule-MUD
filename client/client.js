'use strict'
require('./cli');

const Turms = require('./turms');
const Vorpal = require('vorpal')();
const Hub = Turms.Hub();
const Socket = require('./socket')(Hub);

Object.assign(Vorpal, Turms.Subscriber())
Hub.addSubscription(Vorpal, 'server-connection-opened', (message) => Vorpal.log(message.data));

// Vorpal.use(require('./commands'));

require('./commands')(Vorpal, Hub);

Vorpal.exec('clear').then(function(data) {
	Vorpal.log('Welcome to the Krule-MUD client.');
	Vorpal.log('You are not connected to a server, your options are limited (type `help` if you\'re stuck)');
});

Vorpal.delimiter('Krule-MUD >>').show();
