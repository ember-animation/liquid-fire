import Ember from 'ember';

export default Ember.Controller.extend({
  modalDocumentation: Ember.inject.controller(),
  modalMessage: Ember.computed.alias("modalDocumentation.modalMessage")
});
