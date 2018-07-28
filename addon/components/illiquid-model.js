import Component from '@ember/component';
import layout from "liquid-fire/templates/components/illiquid-model";

const IlliquidModel = Component.extend({
  layout,
  tagName: '',
  didReceiveAttrs() {
    if (!this.get('_fixedModel')) {
      this.set('_fixedModel', this.get('model'));
    }
  }
});

IlliquidModel.reopenClass({
  positionalParams: ['model']
});

export default IlliquidModel;
