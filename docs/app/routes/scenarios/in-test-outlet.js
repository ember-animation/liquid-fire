import Route from '@ember/routing/route';

export default Route.extend({
  renderTemplate(controller, model) {
    this.render({
      into: 'scenarios',
      outlet: 'test',
      controller: controller,
      model: model,
    });
  },
});
