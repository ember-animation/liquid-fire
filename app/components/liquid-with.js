import Ember from "ember";
export default Ember.Component.extend({
  name: 'liquid-with',
  positionalParams: ['value'],
  tagName: '',
  iAmDeprecated: Ember.on('init', function() {
    Ember.deprecate("liquid-with is deprecated, use liquid-bind instead -- it accepts a block now.");
  })
});
