'use strict'

module.exports = {
	// An object to be sent to or received by a Messenger.
	// @param type     A string value that will be used by Messenger.send() to determine
	//                 which of it's subscribers receive() method is called. Defaults to 'message'.
	// @param data     A data object for use in the action callback when a message is sent.
	//                 Defaults to an object with null prototype.
	// @param delay    The length of time a message will wait before being sent. Defaults to 0.
	// @param receiver An optional Messenger object that will receive this message.
	// @return object  A new Message object.
	Message: function(options = Object.create(null)) {
		return Object.assign(Object.create(null), {
			type: options.type || 'message',
			data: options.data || Object.create(null),
			delay: options.delay || 0,
			receiver: options.receiver
		});
	},
	Subscriber: function(hub) {
		return {
			hub: hub,
			receiveMessage: function(action, message) {
				action(message);
			}
		}
	},
	Hub: function() {
		return {
			subscriptions: [],
			queue: [],
			// Adds a new subscription to the Messenger's subscriptions[].
			// @param  subscriber   A Messenger object (or just an object that implements a receive() function).
			// @param  messageType  A string value corresponding to the Message.type on an incoming Message
			//                      that will trigger the subsciber's receive() method.
			// @param  action       A callback that will be triggered when the subscriber receives a Message.
			// @return Object       The subscription object, useful for caching and late use with removeSubscription().
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
			sendMessage: function(message) {
				if (message.delay > 0)
					return this.queueMessage(message);

				for (let i = 0, l = this.subscriptions.length; i < l; i++){
					let subscription = this.subscriptions[i];
					if (message.receiver === undefined && subscription.messageType === message.type)
						subscription.subscriber.receiveMessage(subscription.action, message);
					else if (message.receiver === subscription.subscriber && subscription.messageType === message.type)
						subscription.subscriber.receiveMessage(subscription.action, message);
				}
				return undefined;
			},
			queueMessage: function(message) {
				let delay = message.delay,
					timeout;
				message.delay = 0;
				timeout = setTimeout((timeout) => {
					this.sendMessage(message);
					this.queue.splice(this.queue.indexOf(timeout), 1);
				}, delay);
				this.queue.push(timeout);
				return timeout;
			},
			receiveMessage: function(action, message) {
				action(message);
			}
		};
	}
}
