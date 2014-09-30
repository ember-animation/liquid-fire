import Ember from "ember";
import Modal from "./modal";

export default Ember.Controller.extend({
  needs: ['application'],

  setup: Ember.on('init', function() {

    this.set('modalContexts', Ember.A());
    this.set('modals', Ember.A());

    var modalConfigs = this.container.lookup('router:main').router.modals;
    if (modalConfigs && modalConfigs.length > 0) {
      var self = this;
      modalConfigs.forEach(function(m){ self.registerModal(m); });
      this.appendModalContainer();
    }
  }),

  registerModal: function(config) {
    var ext = {
      modals: this,
      container: this.container,
    };
    config.options.withParams.forEach(function(param) {
      ext[param + "Observer"] = Ember.observer('controller.' + param, function(){
        this.update();
      });
    });
    this.get('modals').pushObject(
      Modal.extend(ext).create(config)
    );
  },

  currentRoute: Ember.computed.alias('controllers.application.currentRouteName'),

  activeRouteNames: Ember.computed('currentRoute', function() {
    var infos = this.container.lookup('router:main').router.currentHandlerInfos;
    if (infos) {
      return infos.map(function(h){  return h.name;  });
    } else {
      return [];
    }
  }),

  appendModalContainer: function() {
    if (this._modalContainer) {
      return;
    }
    var container = this.get('container');
    var Component = container.lookup('component-lookup:main').lookupFactory('liquid-modal');
    this._modalContainer = Component.create({owner: this});
    this._modalContainer.appendTo(container.lookup('application:main').rootElement);
  }

});
