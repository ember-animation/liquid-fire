import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  actions: {
    higher: function (model) {
      this.router.transitionTo(
        'helpers-documentation.liquid-bind-block.page',
        model.get('id') + 1
      );
    },
  },
});
