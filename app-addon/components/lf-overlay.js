import Ember from "ember";
export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['lf-overlay'],
  didInsertElement: function() {
    this._keyBind = Ember.run.bind(this, 'keyUp');
    Ember.$('body').addClass('lf-modal-open').on('keyup', this._keyBind);
  },
  willDestroy: function() {
    Ember.$('body').removeClass('lf-modal-open').off('keyup', this._keyBind);
  },
  click: function() {
    this.sendAction('clickAway');
  },
  keyUp: function(event) {
    if (event.keyCode === 27) {
      this.sendAction('escape');
    }
  }
});
