import Ember from 'ember';

var LiquidBind = Ember.Component.extend({
  tagName: '',
  positionalParams: ['value'] // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
});

LiquidBind.reopenClass({
  positionalParams: ['value']
});

export default LiquidBind;
