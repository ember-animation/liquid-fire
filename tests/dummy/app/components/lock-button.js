import Ember from 'ember';
import Measurement from 'liquid-fire/measurement';

export default Ember.Component.extend({
  actions: {
    lock() {
      this.m = new Measurement(this.$('.target')[0]);
      this.m.lock();
    },
    unlock() {
      this.m.unlock();
    }
  }
});
