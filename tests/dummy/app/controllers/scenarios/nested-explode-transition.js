import Controller from '@ember/controller';

export default Controller.extend({
  showOne: true,
  showA: true,

  actions: {
    toggle(prop) {
      this.toggleProperty(prop);
    },
  },
});
