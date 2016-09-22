'use strict';
const Message = require('./turms').Message;

module.exports = function(Vorpal) {
	Vorpal
		.command('connect')
		.option('-h, --host [host]', 'The host')
		.option('-p, --port [port]', 'The port')
		.alias('c')
		.description('Connects to a MUD server.\n[server] is optional and defaults to \'localhost\'\n[port] is optional and defaults to 1138\n[name] is required\n')
		.action(function(args, cb) {
			let server = args.options.server || 'localhost',
				port = args.options.port || 1138,
				connectionString = 'http://' + server + ':' + port;
			Vorpal.hub.sendMessage(
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
			Vorpal.hub.sendMessage(
				Message({
					type: 'disconnect',
					data: { server: server, port: port }
				})
			);
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
