import Ember from "ember";

export default Ember.Controller.extend({
  start: Ember.on('init', function() {
    var self = this;
    this.interval = setInterval(function(){ Ember.run(self, 'tick'); }, 1000);
    this.tick();
  }),

  willDestroy: function(){
    clearInterval(this.interval);
    this._super();
  },

  tick: function(now) {
    if (!now) {
      /* global moment */
      now = moment();
    }
    this.setProperties({
      now: now,
      hours: now.format('hh'),
      minutes: now.format('mm'),
      seconds: now.format('ss')
    });
  },

  actions: {
    forceTick: function() {
      clearInterval(this.interval);
      this.tick(this.get('now').add({hours: 1, minutes: 1, seconds: 1}));
    }
  }

});
