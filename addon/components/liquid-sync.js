import Ember from 'ember';
import layout from '../templates/components/liquid-sync';

export default Ember.Component.extend({
  layout: layout,
  didInsertElement() {
    const context = this.nearestWithProperty('_isLiquidChild');
    if (context) {
      this._defer = new Ember.RSVP.defer();
      context._waitForMe(this._defer.promise);
    }
  },
  willDestroyElement() {
    if (this._defer) {
      this._defer.resolve();
    }
  },
  actions: {
    ready() {
      if (this._defer) {
        this._defer.resolve();
      }
    }
  }
});
