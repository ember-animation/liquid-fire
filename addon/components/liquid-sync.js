import Component from '@ember/component';
import layout from '../templates/components/liquid-sync';
import Pausable from '../mixins/pausable';

export default Component.extend(Pausable, {
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
