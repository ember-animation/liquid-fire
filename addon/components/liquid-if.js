import Ember from 'ember';
import layout from "liquid-fire/templates/components/liquid-if";

var LiquidIf = Ember.Component.extend({
  positionalParams: ['predicate'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  layout,
  tagName: '',
  helperName: 'liquid-if'
});

LiquidIf.reopenClass({
  positionalParams: ['predicate']
});

export default LiquidIf;
