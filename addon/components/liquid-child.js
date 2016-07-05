import Ember from "ember";
export default Ember.Component.extend({
  classNames: ['liquid-child'],

  init() {
    this._super();
    this._waitingFor = [];
  },

  didInsertElement() {
    let $container = this.$();
    if ($container) {
      $container.css('visibility','hidden');
    }
    this._waitForAll().then(() => {
      if (!this.isDestroying) {
        this._waitingFor = null;
        this.sendAction('liquidChildDidRender', this);
      }
    });
  },

  _isLiquidChild: true,
  _waitForMe(promise) {
    if (!this._waitingFor) {
      return;
    }
    this._waitingFor.push(promise);
    let ancestor = this.nearestWithProperty('_isLiquidChild');
    if (ancestor) {
      ancestor._waitForMe(promise);
    }
  },
  _waitForAll() {
    const promises = this._waitingFor;
    this._waitingFor = [];
    return Ember.RSVP.Promise.all(promises).then(() => {
      if (this._waitingFor.length > 0) {
        return this._waitForAll();
      }
    });
  }

});
