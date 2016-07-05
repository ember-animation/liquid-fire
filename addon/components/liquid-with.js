import Ember from "ember";
import layout from 'liquid-fire/templates/components/liquid-with';

var LiquidWith = Ember.Component.extend({
  layout,
  name: 'liquid-with',
  positionalParams: ['value'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  tagName: '',
  iAmDeprecated: Ember.on('init', function() {
    Ember.deprecate("liquid-with is deprecated, use liquid-bind instead -- it accepts a block now.");
  })
});

LiquidWith.reopenClass({
  positionalParams: ['value']
});

export default LiquidWith;
