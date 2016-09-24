'use strict';
const Message = require('turms').Message;
const os = require('os');
const files = require('./files');

module.exports = function(Vorpal, Hub) {
	Vorpal
		.command('connect')
		.alias('c')
		.option('-h, --host [host]', 'The host')
		.option('-p, --port [port]', 'The port')
		.description('Connects to a MUD server.\n[server] is optional and defaults to \'localhost\'\n[port] is optional and defaults to 1138\n[name] is required\n')
		.action(function(args, cb) {
			let server = args.options.server || 'localhost',
				port = args.options.port || 1138,
				connectionString = 'http://' + server + ':' + port;
			Hub.sendMessage(
				Message({
					type: 'connect',
					data: { server: server, port: port }
				})
			);
			cb();
		});
	Vorpal
		.command('disconnect')
		.alias('d')
		.description('Disconnects from a Krule-MUD server. Should be moved to the in server environment.')
		.action(function(args, cb) {
			Hub.sendMessage(
				Message({
					type: 'disconnect'
				})
			);
			cb();
		});
	Vorpal
		.command('add server')
		.alias('as')
		.option('-n, --name <name>', 'The name of the Krule-MUD server you\'d like to save.')
		.option('-h, --host <host>', 'The host of the Krule-MUD server you\'d like to save.')
		.option('-p, --port <port>', 'The port of the Krule-MUD server you\'d like to save.')
		.description('Saves a Krule-MUD server\'s configuration so you can  connect by name instead of host and port.')
		.validate(function(args) {
			if (!args.options.name || !args.options.host || !args.options.port)
				return '<name>, <host> and <port> are all required to add a server.';
			else
				return true;
		})
		.action(function(args, cb) {
			files.addServer(args.options.name, args.options.host, args.options.port);
			cb();
		});
	Vorpal
		.command('receive message <message>')
		.hidden()
		.action(function(args, cb) {

		});
	Vorpal
		.command('clear', 'Clears the screen.\n')
		.action(function(args, cb) {
			let blank = '';
			for (let i = 0, l = process.stdout.rows; i < l; i++) blank += '\n';
			Vorpal.ui.redraw(blank);
			Vorpal.ui.redraw.clear();
			Vorpal.ui.redraw.done();
			cb();
		});
}
