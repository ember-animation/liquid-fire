import Component from '@ember/component';
// import layout from '../illiquid-model.hbs';

const IlliquidModel = Component.extend({
  // layout,
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
