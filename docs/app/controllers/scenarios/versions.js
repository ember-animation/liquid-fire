import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ScenariosVersionsController extends Controller {
  @tracked name = 'Ed';
  @tracked nextName = '';

  @action
  submitName() {
    this.name = this.nextName;
    this.nextName = '';
  }
}
