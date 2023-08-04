import EmberObject from '@ember/object';
import Route from '@ember/routing/route';

export default class HelpersDocumentationLiquidBindBlockPageRoute extends Route {
  model(params) {
    return EmberObject.create({ id: parseInt(params.id) });
  }
}
