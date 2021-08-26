import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from 'liquid-fire/templates/components/liquid-outlet';
import {
  childRoute,
  routeIsStable,
  modelIsStable,
} from 'liquid-fire/ember-internals';

let LiquidOutlet = Component.extend({
  layout,
  positionalParams: ['inputOutletName'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  tagName: '',
  versionEquality: computed('outletName', 'watchModels', function () {
    let outletName = this.outletName;
    let watchModels = this.watchModels;
    return function (oldValue, newValue) {
      let oldChild = childRoute(oldValue, outletName);
      let newChild = childRoute(newValue, outletName);
      return (
        routeIsStable(oldChild, newChild) &&
        (!watchModels || modelIsStable(oldChild, newChild))
      );
    };
  }),
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('outletName', this.inputOutletName || 'main');
  },
});

LiquidOutlet.reopenClass({
  positionalParams: ['inputOutletName'],
});

export default LiquidOutlet;
