import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HelpersDocumentationLiquidBindBlockIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('helpers-documentation.liquid-bind-block.page', 1);
  }
}
