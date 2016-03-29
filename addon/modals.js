import Ember from "ember";
import getOwner from 'ember-getowner-polyfill';
import Modal from "./modal";

export default Ember.Service.extend({
  routing: Ember.inject.service('-routing'),

  setup: Ember.on('init', function() {

    this.set('modalContexts', Ember.A());
    this.set('modals', Ember.A());

    var owner = getOwner(this);
    var modalConfigs = owner.lookup('router:main').router.modals;
    if (modalConfigs && modalConfigs.length > 0) {
      var self = this;
      modalConfigs.forEach(function(m){ self.registerModal(m); });
    }
  }),

  registerModal: function(config) {
    var ext = {
      modals: this
    };

    for (var param in config.options.withParams) {
      ext[param + "Observer"] = observerForParam(param);
    }

    var owner = getOwner(this);
    if (Ember.setOwner) {
      Ember.setOwner(ext, owner);
    } else {
      ext.container = this.container;
    }

    var ExtendedModal = Modal.extend(ext);

    if (Ember.setOwner) {
      var serviceContext = this;

      Object.defineProperty(ExtendedModal.prototype, 'container', {
        configurable: true,
        enumerable: false,
        get() {
          Ember.deprecate('Using the injected `container` is deprecated. Please use the `getOwner` helper instead to access the owner of this object.',
                          false,
                          { id: 'ember-application.injected-container', until: '3.0.0' });

          return serviceContext.container;
        }
      });
    }

    this.get('modals').pushObject(
      Modal.extend(ext).create(config)
    );
  },

  activeRouteNames: Ember.computed('routing.currentRouteName', function() {
    // We need this to force the right observers to all be in place
    // for invalidation, even though we aren't use it directly.
    this.get('routing.currentRouteName');

    var owner = getOwner(this);
    var infos = owner.lookup('router:main').router.currentHandlerInfos;
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
