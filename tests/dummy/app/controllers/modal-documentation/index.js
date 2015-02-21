import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ["modalDocumentation"],
  modalMessage: Ember.computed.alias("controllers.modalDocumentation.modalMessage")
});
