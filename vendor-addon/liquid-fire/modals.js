import Ember from "ember";

export default Ember.Object.extend({
  registerModals: Ember.on('init', function() {
    var self = this;
    var modals = this.container.lookup('router:main').router.modals;
    if (modals) {
      modals.forEach(function(m){ self.registerModal(m); });
    }
  }),

  registerModal: function(m) {
    console.log("registered", Ember.get(m, 'name'), Ember.get(m, 'route'));
  }
});
