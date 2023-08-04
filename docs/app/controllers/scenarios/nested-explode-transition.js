import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ScenariosNestedExplodeTransitionController extends Controller {
  @tracked showOne = true;
  @tracked showA = true;

  @action
  toggle(prop) {
    this[prop] = !this[prop];
  }
}
