import Ember from "ember";

export default Ember.Controller.extend({
  start: Ember.on('init', function() {
    var self = this;
    this.interval = setInterval(function(){ self.tick();}, 1000);
    this.tick();
  }),

  willDestroy: function(){
    clearInterval(this.interval);
    this._super();
  },

  tick: function() {
    /* global moment */
    var now = moment();
    this.set('hours', now.format('hh'));
    this.set('minutes', now.format('mm'));
    this.set('seconds', now.format('ss'));
  }

});
