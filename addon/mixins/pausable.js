import Ember from 'ember';

export default Ember.Mixin.create({
  _transitionMap: Ember.inject.service('liquid-fire-transitions'),

  _initializeLiquidFirePauseable: Ember.on('init', function() {
    this._lfDefer = [];
  }),
  pauseLiquidFire() {
    const context = this.nearestWithProperty('_isLiquidChild');
    if (context) {
      let defer = new Ember.RSVP.defer();
      let tmap = this.get('_transitionMap');
      tmap.incrementRunningTransitions();
      defer.promise.finally(() => tmap.decrementRunningTransitions());
      this._lfDefer.push(defer);
      context._waitForMe(defer.promise);
    }
  },
  resumeLiquidFire: Ember.on('willDestroyElement', function(){
    let defer = this._lfDefer.pop();
    if (defer) {
      defer.resolve();
    }
  })
});
