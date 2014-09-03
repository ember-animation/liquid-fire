import Ember from "ember";

export default Ember.Controller.extend({
  things: [],

  actions: {
    add: function() {
      this.get('things').pushObject({foo: 'bar'});
    },
    remove: function() {
      this.get('things').popObject();
    }
  }
});
