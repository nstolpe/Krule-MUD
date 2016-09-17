'use strict'

// const emitter = require('events').EventEmitter;

module.exports = {
	Message: function(options) {
		options = options || {};
		return Object.create({
			type: options.type || 'message',
			data: options.data || Object.create(null),
			receiver: options.receiver,
			delay: options.delay || 0
		});
	},
	Messenger: function() {
		const messenger = {
			subscriptions: [],
			addSubscription: function(subscriber, messageType, action) {
				let subscription = {
					subscriber: subscriber,
					messageType: messageType,
					action: action
				}
				this.subscriptions.push(subscription);
				return subscription;
			},
			removeSubscription: function(subscriber, messageType) {
				this.subscriptions.reduce((p, c, i, a) => {
					if (c.subscriber === subscriber) a.splice(i,1);
					return a;
				});
			},
			send: function(message) {
				for (let i = 0, l = this.subscriptions.length; i < l; i++){
					let subscription = this.subscriptions[i];
					if (message.receiver === undefined && subscription.messageType === message.type) {
						console.log(message);
						subscription.subscriber.receive(subscription.action, message);
					}
					else if (message.receiver === subscription.subscriber && subscription.messageType === message.type) {
						subscription.subscriber.receive(subscription.action, message);
					}
				}
			},
			receive: function(action, message) {
				action(message);
			}
		};
		return messenger;
	}
}
