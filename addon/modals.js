import Ember from "ember";
import Modal from "./modal";

export default Ember.Service.extend({
  routing: Ember.inject.service('-routing'),

  setup: Ember.on('init', function() {

    this.set('modalContexts', Ember.A());
    this.set('modals', Ember.A());

    var modalConfigs = this.container.lookup('router:main').router.modals;
    if (modalConfigs && modalConfigs.length > 0) {
      var self = this;
      modalConfigs.forEach(function(m){ self.registerModal(m); });
    }
  }),

  registerModal: function(config) {
    var ext = {
      modals: this,
      container: this.container
    };

    for (var param in config.options.withParams) {
      ext[param + "Observer"] = observerForParam(param);
    }

    this.get('modals').pushObject(
      Modal.extend(ext).create(config)
    );
  },

  activeRouteNames: Ember.computed('routing.currentRouteName', function() {
    // We need this to force the right observers to all be in place
    // for invalidation, even though we aren't use it directly.
    this.get('routing.currentRouteName');

    var infos = this.container.lookup('router:main').router.currentHandlerInfos;
    if (infos) {
      return infos.map(function(h){  return h.name;  });
    } else {
      return [];
    }
  })

});

function observerForParam(param) {
  return Ember.observer('controller.' + param, function() { this.update(); });
}
