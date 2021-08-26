import Component from '@ember/component';
import layout from 'liquid-fire/templates/components/illiquid-model';

const IlliquidModel = Component.extend({
  layout,
  tagName: '',
  didReceiveAttrs() {
    this._super();
    if (!this._fixedModel) {
      this.set('_fixedModel', this.model);
    }
  },
});

IlliquidModel.reopenClass({
  positionalParams: ['model'],
});

export default IlliquidModel;
