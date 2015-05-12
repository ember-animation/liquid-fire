import Ember from "ember";

export default Ember.Component.extend({
  positionalParams: ['inputOutletName'],
  tagName: '',
  didReceiveAttrs() {
    this.set('outletName', this.attrs.inputOutletName || 'main');
  }
});
