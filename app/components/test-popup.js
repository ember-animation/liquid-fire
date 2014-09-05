import Ember from "ember";
export default Ember.Component.extend({
  actions: {
    bing: function (){ alert("bingbang"); },
    escape: function() {
      if (confirm("really leave?")) {
        this.sendAction('dismiss');
      }
    }
  }
});
