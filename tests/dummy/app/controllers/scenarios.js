import Controller from '@ember/controller';
import { dependencySatisfies } from '@embroider/macros';

export default Controller.extend({
  queryParams: ['testSalutation', 'testPerson'],
  actions: {
    changeSalutation: function () {
      this.set('testSalutation', 'Hola');
    },
  },

  supportsNamedOutlets: dependencySatisfies('ember-source', '<4.0.0-alpha.0'),
});
