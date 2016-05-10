import Ember from 'ember';
import layout from '../templates/components/liquid-sync';
import Pausable from '../mixins/pausable';

export default Ember.Component.extend(Pausable, {
  tagName: '',
  layout: layout,
  didInsertElement() {
    this.pauseLiquidFire();
  },
  actions: {
    ready() {
      this.resumeLiquidFire();
    }
  }
});
