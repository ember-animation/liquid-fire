import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ScenariosStefController extends Controller {
  @tracked isExpanded = true;

  @action
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
