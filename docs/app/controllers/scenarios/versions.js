import Controller from '@ember/controller';

export default Controller.extend({
  name: 'Ed',
  actions: {
    submitName: function () {
      this.set('name', this.nextName);
      this.set('nextName', '');
    },
  },
});
