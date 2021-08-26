import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    increment: function () {
      this.transitionToRoute('test-with', parseInt(this.get('model.id')) + 1);
    },
    decrement: function () {
      this.transitionToRoute('test-with', parseInt(this.get('model.id')) - 1);
    },
  },
});
