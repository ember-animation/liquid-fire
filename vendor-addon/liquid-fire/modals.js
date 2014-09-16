import Ember from "ember";
import Modal from "./modal";

export default Ember.Object.extend({
  setup: Ember.on('init', function() {

    this.set('modalContexts', Ember.A());
    this.set('modals', Ember.A());
    this.set('appController', this.container.lookup('controller:application'));

    var modalConfigs = this.container.lookup('router:main').router.modals;
    if (modalConfigs && modalConfigs.length > 0) {
      modalConfigs.forEach(this.registerModal.bind(this));
    }

    Ember.run.schedule('afterRender', this, 'appendModalContainer');
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

  currentRoute: Ember.computed.alias('appController.currentRouteName'),

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
    this._modalContainer.appendTo('body');
  }

});
