import Controller from '@ember/controller';

export default Controller.extend({
  isExpanded: true,
  actions: {
    toggle: function () {
      this.toggleProperty('isExpanded');
    },
  },
});
