import Ember from "ember";
export default Ember.Controller.extend({
  count: 1,
  things: [{number: 0}],
  
  actions: {
    addThing: function() {
      this.things.pushObject({ number: ++this.count });
    },
    removeThing: function() {
      this.things.replace(0, 1);
    }
  }
  
});
