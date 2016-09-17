'use strict'
// hermes = require('./client/hermes')
// f = hermes.Hub();
// f.addObserver(f.Observer({receive: function() { console.log(msg) } }, 'foo'))
// f.addObserver(f.Observer({receive: function(msg) { console.log(msg) } }, 'bar'))
//
// f.send(f.Message('bar', 'opening message', ()=>console.log('ggg')))

const events = require('events');

const receiver = {
    receive: {
        value: function(msg) { this.emit('message', msg); }
    },
    hub: {
        configurable: true,
        get: function() { return this._hub; },
        set: function(hub) { this._hub = hub; }
    },
    send: {
        value: function(msg) { this.hub.send(msg); }
    }
}
const hub = {
    /**
     * Initializer that binds the message event.
     */
    init: {
        value: function() {
            this.observerKeys = Object.keys(this.Observer(null, null, null));
            this.messageKeys = Object.keys(this.Message(null, null, null));
            this.on('message', (msg) => this.broadcast(msg));
            this.observers = [];
            return this;
        }
    },
    /**
     * Object for messages. Calback default is an empty function.
     */
    Message: {
        value: function(type, text, cb=()=>{}) {
            return { type: type, text: text, cb: cb };
        }
    },
    Observer: {
        value: function(recipient, messageType, sender=null) {
            return { recipient: recipient, messageType: messageType, sender: sender };
        }
    },
    broadcast: {
        value: function(msg) {
            for (let i = 0, l = this.observers.length; i < l; i++) {
                if (this.observers[i].messageType === msg.type)
                    this.observers[i].recipient.receive(msg)
            }
        }
    },
    send: {
        value: function(msg) {
            this.emit('message', msg);
        }
    },
    /**
     * Use this to validate messages and observers
     */
    validateKeys: {
        value: function(incoming, source) {
            return !Object.keys(incoming).filter((el) => source.indexOf(el) < 0).length;
        }
    },
    addObserver: {
        value: function(observer) {
            this.observers.push(observer);
        }
    },
    removeObserver: {
        value: function(observer) {
            this.observers.splice(this.observers.indexOf(observer), 1);
        }
    }
}

function Hub() {
    let H = Object.create(function() {});
    H.prototype = Object.create(events.EventEmitter.prototype, hub);
    return Object.create(H.prototype).init();
}
/**
 * Functionality for Receivers should be packaged in proto and passed
 * in.
 */
function Receiver(proto) {
    let R = Object.create(function() {}),
        X = Object.create(function() {});
    R.prototype = Object.create(events.EventEmitter.prototype, receiver);
    X.prototype = Object.create(R.prototype, proto);
    return Object.create(R.prototype);
}

module.exports = {
    Hub: Hub,
    makeReceiver: makeReceiver
};
