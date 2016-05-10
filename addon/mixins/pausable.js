import Ember from 'ember';

export default Ember.Mixin.create({
  _initializeLiquidFirePauseable: Ember.on('init', function() {
    this._lfDefer = [];
  }),
  pauseLiquidFire() {
    const context = this.nearestWithProperty('_isLiquidChild');
    if (context) {
      let defer = new Ember.RSVP.defer();
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
