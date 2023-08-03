import Component from '@glimmer/component';

export default class IlliquidModelComponent extends Component {
  _fixedModel = null;

  constructor() {
    super(...arguments);
    this._fixedModel = this.args.model;
  }
}
