import Ember from "ember";
import layout from 'liquid-fire/templates/components/liquid-outlet';
import { routeIsStable } from 'liquid-fire/ember-internals';

var LiquidOutlet = Ember.Component.extend({
  layout,
  positionalParams: ['inputOutletName'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  tagName: '',
  didReceiveAttrs() {
    this._super();
    this.set('outletName', this.get('inputOutletName') || 'main');
  },
  versionEquality: Ember.computed('outletName', function() {
    let outletName = this.get('outletName');
    return function(oldValue, newValue) {
      return routeIsStable(oldValue, newValue, outletName);
    };
  })
});

LiquidOutlet.reopenClass({
  positionalParams: ['inputOutletName']
});

export default LiquidOutlet;
