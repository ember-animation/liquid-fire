import Ember from "ember";
// BEGIN-SNIPPET hello-modal
export default Ember.Component.extend({
  actions: {
    gotIt: function() {
      this.sendAction('dismiss');
    }
  }
});
// END-SNIPPET
