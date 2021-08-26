import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel: function () {
    this.transitionTo('helpers-documentation.liquid-bind-block.page', 1);
  },
});
