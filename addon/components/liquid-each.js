import Ember from 'ember';
import layout from '../templates/components/liquid-each';

let LiquidEach = Ember.Component.extend({
  layout: layout,
  animate: Ember.observer('elements.[]', function() {
    console.log("liquid each animating");
  }),
  ghostRender() {

  }
});

LiquidEach.reopenClass({
  positionalParams: ['elements']
});

export default LiquidEach;
