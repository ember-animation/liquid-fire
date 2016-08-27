import Ember from 'ember';
import layout from 'liquid-fire/templates/components/liquid-bind';

var LiquidBind = Ember.Component.extend({
  layout,
  tagName: '',
  positionalParams: ['value'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  forwardMatchContext: Ember.computed('matchContext', function() {
    let m = this.get('matchContext');
    if (!m) {
      m = {};
    }
    if (!m.helperName) {
      m.helperName = 'liquid-bind';
    }
    return m;
  })
});

LiquidBind.reopenClass({
  positionalParams: ['value']
});

export default LiquidBind;
