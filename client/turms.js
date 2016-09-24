'use strict'

module.exports = {
	/**
	 * An object to be sent to or received by a Messenger.
	 * @param type     A string value that will be used by Messenger.send() to determine
	 *                 which of it's subscribers receive() method is called. Defaults to 'message'.
	 * @param data     A data object for use in the action callback when a message is sent.
	 *                 Defaults to an object with null prototype.
	 * @param delay    The length of time a message will wait before being sent. Defaults to 0.
	 * @param recipient An optional Messenger object that will receive this message.
	 * @return object  A new Message object.
	 */
	Message: function(options) {
		if (!options) options = Object.create(null);

		return Object.assign(Object.create(null), {
			type: options.type || 'message',
			data: options.data || Object.create(null),
			delay: options.delay || 0,
			recipient: options.recipient
		});
	},
	/**
	 * An object that can receive messages. Useful by itself or with Object.assign(ob, subscriber)
	 */
	Subscriber: function() {
		return {
			receiveMessage: function(action, message) {
				action(message);
			}
		}
	},
	/**
	 * An object that manages subscribers and dispatches messages to them.
	 */
	Hub: function() {
		return {
			subscriptions: [],
			queue: [],
			/**
			 * Adds a new subscription to the Messenger's subscriptions[].
			 * @param  subscriber   A Subscriber object.
			 * @param  messageType  A string value corresponding to Message.type on an incoming Message
			 * @param  action       A callback that will be triggered when the subscriber receives a Message.
			 * @return Object       The subscription object, useful for caching and late use with removeSubscription().
			 */
			addSubscription: function(subscriber, messageType, action) {
				let subscription = {
					subscriber: subscriber,
					messageType: messageType,
					action: action
				}
				this.subscriptions.push(subscription);
				return subscription;
			},
			/**
			 * Removes a subscription with a specific type and specific subscriber.
			 * @param subscriber  A Subscriber object.
			 * @param messageType A string value corresponding to Message.type on an incoming Message.
			 */
			removeSubscription: function(subscriber, messageType) {
				this.subscriptions.reduce((p, c, i, a) => {
					if (c.subscriber === subscriber) a.splice(i,1);
					return a;
				});
			},
			/**
			 * Filtres subscriptions based on messageType and/or recipient
			 */
			filterSubscriptions: function(message) {
				return this.subscriptions.filter((subscription) => {
					return message.recipient ?
						message.type === subscription.messageType && subscription.subscriber === message.recipient :
						message.type === subscription.messageType;
				});
			},
			sendMessage: function(message) {
				if (message.delay > 0)
					return this.queueMessage(message);

				let subscriptions = this.filterSubscriptions(message);

				for (let i = 0, l = subscriptions.length; i < l; i++)
					subscriptions[i].subscriber.receiveMessage(subscriptions[i].action, message);
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
			}
		};
	}
}
