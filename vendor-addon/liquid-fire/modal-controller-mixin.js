import Ember from "ember";

export var ModalControllerMixin = Ember.Mixin.create({
  initializeModalContext: Ember.on('init', function() {
    this.set('modalContexts', Ember.A());
    Ember.run.scheduleOnce('afterRender', this, 'appendModalContainer');
  }),

  appendModalContainer: function() {
    var container = this.get('container');
    var Component = container.lookup('component-lookup:main').lookupFactory('liquid-modal');
    this._modalContainer = Component.create({owner: this});
    this._modalContainer.appendTo('body');
  },

  updateModalContext: function(componentName, paramNames) {
    var params = currentParams(this, paramNames);
    var ctxts = this.get('modalContexts');
    var matchingContext = ctxts.find(function(c) { return c.name === componentName; });
    if (!params) {
      if (matchingContext) {
        ctxts.removeObject(matchingContext);
      }
    } else {
      var newContext = Ember.Object.create({
        name: componentName,
        params: params
      });
      if (matchingContext) {
        ctxts.replace(ctxts.indexOf(matchingContext), 1, [newContext]);
      } else {
        ctxts.pushObject(newContext);
      }
    }
  }
});

export function launchModal(componentName) {
  var params = Array.prototype.slice.call(arguments, 1);
  var handler = function() {
    this.updateModalContext(componentName, params);
  };

  return Ember.observer.apply(Ember, params.concat(handler));
}

function currentParams(controller, paramNames) {
  var params={},
      foundTruthy = false,
      name,
      value;

  for (var i = 0; i < paramNames.length; i++) {
    name = paramNames[i];
    value = controller.get(name);
    params[name] = value;
    if (value) {
      foundTruthy = true;
    }
  }
  if (foundTruthy) {
    return params;
  }
}
