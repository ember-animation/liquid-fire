import Ember from "ember";
export default Ember.Controller.extend({
  queryParams: ['testSalutation', 'testPerson'],
  actions: {
    changeSalutation: function() {
      this.set('testSalutation', 'Hola');
    }
  }
});
