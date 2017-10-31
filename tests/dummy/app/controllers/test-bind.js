import Controller from '@ember/controller';

export default Controller.extend({
  counter: 0,

  init: function(){
    let self = this;
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
