import Component from '@glimmer/component';
import { action } from '@ember/object';
import { defer } from 'rsvp';
import service from '../-private/service.ts';
import { modifier } from 'ember-modifier';
import './liquid-sync.css';

export default class LiquidSyncComponent extends Component {
  @service liquidFireChildren;
  @service('liquid-fire-transitions') _transitionMap;

  _lfDefer = [];

  willDestroy() {
    super.willDestroy();
    this.ready();
  }

  @action
  ready() {
    this.resumeLiquidFire();
  }

  setup = modifier((element) => {
    if (this._didSetup) {
      return;
    }

    this._didSetup = true;

    this.element = element;
    this.pauseLiquidFire();
  });

  pauseLiquidFire() {
    const context = this.liquidFireChildren.closest(this.element);
    if (context) {
      const def = new defer();
      const tmap = this._transitionMap;
      tmap.incrementRunningTransitions();
      def.promise.finally(() => tmap.decrementRunningTransitions());
      this._lfDefer.push(def);
      context._waitForMe(def.promise);
    }
  }

  @action
  resumeLiquidFire() {
    const def = this._lfDefer.pop();
    if (def) {
      def.resolve();
    }
  }
}
