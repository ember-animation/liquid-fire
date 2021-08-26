import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    higher: function (model) {
      this.transitionToRoute(
        'helpers-documentation.liquid-bind-block.page',
        model.get('id') + 1
      );
    },
  },
});
