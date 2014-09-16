import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['salutation', 'person'],
  salutation: null,
  person: null
});
