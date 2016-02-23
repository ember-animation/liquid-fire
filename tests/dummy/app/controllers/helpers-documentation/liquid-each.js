import Ember from "ember";

var idCounter = 0;
var sampleMessages = [
  {
    from: "Trumpster",
    subject: "RE:FW:FW:FW:FW Make Javascript Great Again"
  },
  {
    from: "Godhuda",
    subject: "Glimmer 2 is done"
  },
  {
    from: "The King",
    subject: "Business Opportunity"
  }
];

function messageFactory() {
  let id = idCounter++;
  let message = Object.create(sampleMessages[id % sampleMessages.length]);
  message.id = id;
  return message;
}

export default Ember.Controller.extend({
  init() {
    this.set('messages', Ember.A([
      messageFactory(), messageFactory(), messageFactory()
    ]));
  },

  actions: {
    addMessage() {
      this.get('messages').pushObject(messageFactory());
    },

    deleteMessage(message) {
      this.get('messages').removeObject(message);
    }
  }

});
