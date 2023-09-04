import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class ScenariosSpacerController extends Controller {
  @tracked count = 1;
  @tracked things = A([{ number: 0 }]);

  @action
  addThing() {
    this.things.pushObject({ number: ++this.count });
  }

  @action
  removeThing() {
    this.things.replace(0, 1);
  }
}
