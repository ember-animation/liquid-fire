import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HelpersDocumentationLiquidBindBlockPageController extends Controller {
  @service router;

  @action
  higher(model) {
    this.router.transitionTo(
      'helpers-documentation.liquid-bind-block.page',
      model.get('id') + 1
    );
  }
}
