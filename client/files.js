'use strict'

const os = require('os');
const fs = require('fs');
const path = require('path');

const configPath = path.join(os.homedir(), '.krule-mud-client');

// creates the config directory if it doesn't exist.
const verifyConfigPath = function() {
	try {
		fs.accessSync(configPath);
	} catch (e) {
		fs.mkdirSync(configPath);
	}
}

// creates servers.json in the config directory if it doesn't exist.
const verifyServersConfig = function() {
	try {
		fs.statSync(path.join(configPath, 'servers.json'));
	} catch (e) {
		fs.writeFileSync(path.join(configPath, 'servers.json'), '[]');
	}
}

const addServer = function(name, host, port) {
	let servers = getServers();
	servers.push({ name: name, host: host, port: port });
	fs.writeFileSync(path.join(configPath, 'servers.json'), JSON.stringify(servers), 'utf8');
}

const getServers = function() {
	return JSON.parse(fs.readFileSync(path.join(configPath, 'servers.json'), 'utf8', 'utf8'))
}
module.exports = {
	configPath: configPath,
	verifyConfigPath: verifyConfigPath,
	verifyServersConfig: verifyServersConfig,
	getServers: getServers,
	addServer: addServer
};
