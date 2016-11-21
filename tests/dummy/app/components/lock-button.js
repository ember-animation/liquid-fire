import Ember from 'ember';
import AnimatedElement from 'liquid-fire/animated-element';

export default Ember.Component.extend({
  actions: {
    lock() {
      this.m = new AnimatedElement(this.$('.target')[0]);
      this.m.lock();
    },
    unlock() {
      this.m.unlock();
    }
  }
});
