'use strict'
const Vorpal = require('vorpal')();
const Socket = require('./socket');
require('./cli');
// Vorpal.Socket = require('./socket')(Vorpal);
// var socket;



Vorpal
	.use(require('./socket'))
	.use(require('./commands'));

Vorpal.exec('clear').then(function(data) {
	Vorpal.log('Welcome to the Krule-MUD client.');
	Vorpal.log('You are not connected to a server, your options are limited (type `help` if you\'re stuck)');
});

Vorpal.delimiter('Krule-MUD >>').show();
