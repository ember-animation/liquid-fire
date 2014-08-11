import Ember from "ember";

export default Ember.Controller.extend({
  start: function() {
    var self = this;
    this.interval = setInterval(function(){ self.tick();}, 1000);
    this.tick();
  }.on('init'),

  stop: function() {
    clearInterval(this.interval);
  }.on('willDestroy'),

  tick: function() {
    /* global moment */
    var now = moment();
    this.set('hours', now.format('hh'));
    this.set('minutes', now.format('mm'));
    this.set('seconds', now.format('ss'));
  }

});
