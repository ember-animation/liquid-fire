import Ember from "ember";
export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['lf-overlay'],
  didInsertElement: function() {
    Ember.$('body').addClass('lf-modal-open');
  },
  willDestroy: function() {
    Ember.$('body').removeClass('lf-modal-open');
  },
  click: function() {
    this.sendAction('clickAway');
  }
});
