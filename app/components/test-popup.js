import Ember from "ember";
export default Ember.Component.extend({
  actions: {
    bing: function (){ alert("bingbang"); },
    escape: function() { this.sendAction('dismiss'); },
    outsideClick: function() { this.sendAction('dismiss'); }
  }
});
