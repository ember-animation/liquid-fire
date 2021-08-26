import { defer } from 'rsvp';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  _transitionMap: service('liquid-fire-transitions'),

  _initializeLiquidFirePauseable: on('init', function () {
    this._lfDefer = [];
  }),
  pauseLiquidFire() {
    const context = this.nearestWithProperty('_isLiquidChild');
    if (context) {
      let def = new defer();
      let tmap = this._transitionMap;
      tmap.incrementRunningTransitions();
      def.promise.finally(() => tmap.decrementRunningTransitions());
      this._lfDefer.push(def);
      context._waitForMe(def.promise);
    }
  },
  resumeLiquidFire: on('willDestroyElement', function () {
    let def = this._lfDefer.pop();
    if (def) {
      def.resolve();
    }
  }),
});
