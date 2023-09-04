import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Ember from 'ember';

export default class ResetScrollRoute extends Route {
  @service fastboot;
  activate() {
    super.activate();
    if (!Ember.testing && !this.fastboot.isFastBoot) {
      window.scrollTo(0, 0);
    }
  }
}
