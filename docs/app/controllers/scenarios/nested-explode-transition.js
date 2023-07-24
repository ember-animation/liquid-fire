import Controller from '@ember/controller';

export default Controller.extend({
  showOne: true,
  showA: true,

  init() {
    this._super(...arguments);
  },

  actions: {
    toggle(prop) {
      this.toggleProperty(prop);
    },
  },
});
