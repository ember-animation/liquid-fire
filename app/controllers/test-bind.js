import Ember from 'ember';

export default Ember.Controller.extend({
  counter: 0,

  init: function(){
    var self = this;
    this.interval = setInterval(function(){ self.tick(); }, 1000);
    this.tick();
  },
    
  willDestroy: function(){
    clearInterval(this.interval);
  },

  tick: function(){
    this.set('counter', this.get('counter') + 1);
  }
});
