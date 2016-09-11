'use strict'
const Vorpal = require('vorpal')();
require('pkginfo')(module, 'version');
const version = module.exports.version;
const commander = require('commander');
const Socket = require('./socket');
// Vorpal.Socket = require('./socket')(Vorpal);
// var socket;

commander
	.version(version)
	.usage('[options] Launches a krule-MUD terminal. If [server] is passed an attempt will be made to connect automatically.')
	.option('-s, --server [server]', 'The host to connect to. Defaults to `localhost` when passed without value.')
	.option('-p, --port [port]', 'The port to connect to on [server]. Requires [server]. Defaults to `1138` when passed with not value or when [server] is passed without [port].')
	.parse(process.argv);

Vorpal
	.use(require('./socket'))
	.use(require('./commands'));

Vorpal.exec('clear').then(function(data) {
	Vorpal.log('Welcome to the Krule-MUD client.');
	Vorpal.log('You are not connected to a server, your options are limited (type `help` if you\'re stuck)');
});

Vorpal.delimiter('Krule-MUD >>').show();
