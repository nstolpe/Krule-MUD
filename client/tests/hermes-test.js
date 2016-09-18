'use strict'

const chai = require('chai');
const expect = chai.expect;
const Hermes = require('../hermes');

describe('Hermes', function() {
	it('Message() should return default values if `options` is empty or not passed', function() {
		let defaultMessage = Hermes.Message({
			type: 'message',
			data: Object.create(null),
			delay: 0,
			receiver: undefined
		});
		let message = Hermes.Message();
		expect(message).to.eql(defaultMessage);
	});
	it('A Messenger\'s addSubscription() method should add a new subscription object to Messenger.subscriptions. That object should have properties and values corresponding to addSubscription arguments.', function() {
		let m1 = Hermes.Messenger();
		let m2 = Hermes.Messenger();
		let subscription = {
			subscriber: m2,
			messageType: 'test-message',
			action: function(data) { console.log(data); }
		}
		m1.addSubscription(subscription.subscriber, subscription.messageType, subscription.action);

		expect(m1.subscriptions[0]).to.eql(subscription);
	});
	it('A Messenger\'s addSubscription() method should return a new subscription object with properties and values corresponding to the arguments passed in', function() {
		let m1 = Hermes.Messenger();
		let m2 = Hermes.Messenger();
		let subscription = {
			subscriber: m2,
			messageType: 'test-message',
			action: function(data) { console.log(data); }
		}
		let newSubscription = m1.addSubscription(subscription.subscriber, subscription.messageType, subscription.action);

		expect(newSubscription).to.eql(subscription);
	});
});
