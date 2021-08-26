import moment from 'moment';
import Component from '@ember/component';
import { run } from '@ember/runloop';

export default Component.extend({
  init() {
    this._super();
    this.tick();
  },

  didInsertElement() {
    this._super(...arguments);
    let self = this;
    this.interval = setInterval(function () {
      run(self, 'tick');
    }, 1000);
  },

  willDestroyElement() {
    clearInterval(this.interval);
    this._super();
  },

  tick: function (now) {
    if (!now) {
      now = moment();
    }
    this.setProperties({
      now: now,
      hours: now.format('hh'),
      minutes: now.format('mm'),
      seconds: now.format('ss'),
    });
  },

  actions: {
    forceTick: function () {
      clearInterval(this.interval);
      this.tick(this.now.add({ hours: 1, minutes: 1, seconds: 1 }));
    },
  },
});
