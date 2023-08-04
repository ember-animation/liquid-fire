import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ScenariosGrowableWithController extends Controller {
  @tracked otherState = false;

  get myThing() {
    if (this.otherState) {
      return { description: 'Foo' };
    } else {
      return { description: 'Bar baz qux' };
    }
  }
}
