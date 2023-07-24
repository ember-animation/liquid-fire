import Controller from '@ember/controller';

export default Controller.extend({
  counter: 0,

  init() {
    this._super(...arguments);
    this.interval = setInterval(() => this.tick(), 1000);
    this.tick();
  },

  willDestroy: function () {
    clearInterval(this.interval);
  },

  tick: function () {
    this.set('counter', this.counter + 1);
  },
});
