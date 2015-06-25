import Ember from "ember";
import Modal from "./modal";

export default Ember.Service.extend({
  // needs: ['application'],

  setup: Ember.on('init', function() {

    this.set('modalContexts', Ember.A());
    this.set('modals', Ember.A());

    var router = this.container.lookup('router:main');
    var controller = this.container.lookup('controller:application');
    var modalConfigs = router.router.modals;
    if (modalConfigs && modalConfigs.length > 0) {
      var self = this;
      modalConfigs.forEach(function(m){ self.registerModal(m); });
      router.on('didTransition', function() {
        self.set('currentRoute', controller.get('currentRouteName'));
      });
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

  // currentRoute: Ember.computed.alias('controllers.application.currentRouteName'),

  activeRouteNames: Ember.computed('currentRoute', function() {
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
