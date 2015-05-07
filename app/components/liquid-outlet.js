import Ember from "ember";

export default Ember.Component.extend({
  positionalParams: ['inputOutletName'],
  tagName: '',
  willRender() {
    this.set('outletName', this.attrs.inputOutletName || 'main');
  }
});
