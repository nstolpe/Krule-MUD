'use strict'

require('pkginfo')(module, 'version');
const version = module.exports.version;
const commander = require('commander');

commander
	.version(version)
	.usage('[options] Launches a krule-MUD terminal. If [server] is passed an attempt will be made to connect automatically.')
	.option('-s, --server [server]', 'The host to connect to. Defaults to `localhost` when passed without value.')
	.option('-p, --port [port]', 'The port to connect to on [server]. Requires [server]. Defaults to `1138` when passed with not value or when [server] is passed without [port].')
	.parse(process.argv);

// if the params are there, send message
// to connect to the incoming server/port
