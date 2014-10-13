import Ember from "ember";
// BEGIN-SNIPPET modal-controller
export default Ember.Controller.extend({
  queryParams: ['salutation', 'person'],
  salutation: null,
  person: null
});
// END-SNIPPET
