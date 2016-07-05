import Ember from "ember";
import layout from 'liquid-fire/templates/components/liquid-outlet';

var LiquidOutlet = Ember.Component.extend({
  layout,
  positionalParams: ['inputOutletName'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  tagName: '',
  didReceiveAttrs() {
    this._super();
    this.set('outletName', this.attrs.inputOutletName || 'main');
  }
});

LiquidOutlet.reopenClass({
  positionalParams: ['inputOutletName']
});

export default LiquidOutlet;
