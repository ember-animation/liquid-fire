import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['testSalutation', 'testPerson'],
  actions: {
    changeSalutation: function () {
      this.set('testSalutation', 'Hola');
    },
  }
});
