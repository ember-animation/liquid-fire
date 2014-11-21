import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ["modalDocumentation"],
  modalMessage: Ember.computed.alias("controllers.modalDocumentation.modalMessage")
});