'use strict'
const events = require('events');

const hub = {
    /**
     * Initializer that binds the message event.
     */
    init: {
        value: function() {
            this.observerKeys = Object.keys(this.Observer(null, null, null));
            this.messageKeys = Object.keys(this.Message(null, null, null));
            this.on('message', (msg) => this.handleMessage(msg));
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
        value: function(recipient, message, sender=null) {
            return { recipient: recipient, message: message, sender: sender };
        }
    },
    handleMessage: {
        value: function(msg) {
            console.log(msg);
            // cb();
        }
    },
    validateKeys: {
        value: function(incoming, source) {
            return !Object.keys(incoming).filter((el) => source.indexOf(el) < 0).length;
        }
    },
    addObserver: function(observer) {
        this.observers.push(observer);
    },
    removeObserver: function(observer) {
        this.observers.splice(this.observers.indexOf(observer));
    },
    broadcast: function(message) {
        let recipients = this.observers.filter(el => el.message === message);
        console.log(recipients);
    }
}

function Hub() {
    const H = Function.prototype;
    H.prototype = Object.create(events.EventEmitter.prototype, hub);
    return Object.create(H.prototype).init();
}
    // Sender() {
    //     return Object.create(this.sender);
    // },
    // sender: {
    //     send: function(message) {
    //
    //     }
    // },
    // Receiver() {
    //     return = Object.create(this.receiver);
    // },
    // receiver: {
    //     receive: function(message) {
    //
    //     }
    // }

module.exports = {
    Hub: Hub
};
