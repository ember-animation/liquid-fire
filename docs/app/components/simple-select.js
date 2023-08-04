import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SimpleSelectComponent extends Component {
  @action
  change(evt) {
    this.args.onChange(evt.target.value);
  }
}
