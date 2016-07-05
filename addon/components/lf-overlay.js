import Ember from "ember";
var COUNTER = '__lf-modal-open-counter';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['lf-overlay'],

  didInsertElement: function() {
    var body = Ember.$('body');
    var counter = body.data(COUNTER) || 0;
    body.addClass('lf-modal-open');
    body.data(COUNTER, counter+1);
  },

  willDestroy: function() {
    var body = Ember.$('body');
    var counter = body.data(COUNTER) || 0;
    body.data(COUNTER, counter-1);
    if (counter < 2) {
      body.removeClass('lf-modal-open lf-modal-closing');
    }
  }
});
