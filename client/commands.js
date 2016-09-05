'use strict';

module.exports = function(Vorpal) {
	Vorpal
		.command('connect')
		.option('-h, --server [server]', 'The server')
		.option('-p, --port [port]', 'The port')
		// .option('-n, --name <name>', 'User/account name')
		.alias('cn')
		.description('Connects to a MUD server.\n[server] is optional and defaults to \'localhost\'\n[port] is optional and defaults to 1138\n[name] is required\n')
		// .validate(function(args) {
		// 	if (args.options.name === undefined)
		// 		return Vorpal.chalk.red('The <name> option is required. See `help connect` for details');
		// 	return true;
		// })
		.action(function(args, cb) {
			let server = args.options.server || 'localhost',
				port = args.options.port || 1138,
				connectionString = 'http://' + server + ':' + port;
				
			Vorpal.Socket.connect(server, port);
			cb();
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
