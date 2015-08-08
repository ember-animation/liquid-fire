import Ember from 'ember';
import { shouldDisplay } from 'liquid-fire/ember-internals';

var LiquidIf = Ember.Component.extend({
  positionalParams: ['predicate'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  tagName: '',
  helperName: 'liquid-if',
  didReceiveAttrs() {
    this._super();
    var predicate = shouldDisplay(this.getAttr('predicate'));
    this.set('showFirstBlock', this.inverted ? !predicate : predicate);
  }
});

LiquidIf.reopenClass({
  positionalParams: ['predicate']
});

export default LiquidIf;
