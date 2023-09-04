import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TransitionsPredefinedController extends Controller {
  @tracked showDetail = false;
  @tracked activeTab = 'toLeft';

  @action
  toggleDetail() {
    this.showDetail = !this.showDetail;
  }

  @action
  changeTab(tabName) {
    this.activeTab = tabName;
  }
}
