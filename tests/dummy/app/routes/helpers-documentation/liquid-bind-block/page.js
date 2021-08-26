import EmberObject from '@ember/object';
import Route from '@ember/routing/route';

export default Route.extend({
  model: function (params) {
    return EmberObject.create({ id: parseInt(params.id) });
  },
});
