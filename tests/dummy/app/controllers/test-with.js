import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  actions: {
    increment: function () {
      this.router.transitionTo('test-with', parseInt(this.get('model.id')) + 1);
    },
    decrement: function () {
      this.router.transitionTo('test-with', parseInt(this.get('model.id')) - 1);
    },
  },
});
