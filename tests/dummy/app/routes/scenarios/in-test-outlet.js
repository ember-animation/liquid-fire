import Ember from "ember";

export default Ember.Route.extend({
  renderTemplate(controller, model) {
    this.render({
      into: 'scenarios',
      outlet: 'test',
      controller: controller,
      model: model
    });
  }
});
