import Ember from "ember";
export default Ember.Controller.extend({
  count: 1,
  things: [{number: 0}],
  longMessage: "This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. ",
  shortMessage: "Hi.",
  showLongMessage: true,
  
  actions: {
    addThing: function() {
      this.things.pushObject({ number: ++this.count });
    },
    removeThing: function() {
      this.things.replace(0, 1);
    }
  }
  
});
