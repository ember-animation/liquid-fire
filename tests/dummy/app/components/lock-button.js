import Ember from 'ember';
import Sprite from 'liquid-fire/sprite';

export default Ember.Component.extend({
  actions: {
    lock() {
      this.m = new Sprite(this.$('.target')[0]);
      this.m.lock();
    },
    unlock() {
      this.m.unlock();
    }
  }
});
