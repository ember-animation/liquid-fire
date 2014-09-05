import Ember from "ember";

export var ModalControllerMixin = Ember.Mixin.create({
  initializeModalContext: Ember.on('init', function() {
    this.set('modalContexts', Ember.A());
  }),

  appendModalContainer: function() {
    if (this._modalContainer) {
      return;
    }
    var container = this.get('container');
    var Component = container.lookup('component-lookup:main').lookupFactory('liquid-modal');
    this._modalContainer = Component.create({owner: this});
    this._modalContainer.appendTo('body');
  },

  updateModalContext: function(componentName, opts) {
    var params = currentParams(this, opts.withParams);
    var ctxts = this.get('modalContexts');
    var matchingContext = ctxts.find(function(c) { return c.name === componentName; });
    if (!params) {
      if (matchingContext) {
        ctxts.removeObject(matchingContext);
      }
    } else {
      var newContext = Ember.Object.create({
        name: componentName,
        params: params,
        opts: opts
      });
      if (matchingContext) {
        ctxts.replace(ctxts.indexOf(matchingContext), 1, [newContext]);
      } else {
        ctxts.pushObject(newContext);
      }
    }
    if (ctxts.length > 0) {
      Ember.run.scheduleOnce('afterRender', this, 'appendModalContainer');
    }
  }
});

export function launchModal(componentName, opts) {
  Ember.assert('launchModal("' + componentName + '",...) needs a `withParams` argument', opts && opts.withParams);

  opts = Ember.copy(opts);

  if (!Ember.isArray(opts.withParams)) {
    opts.withParams = [opts.withParams];
  }

  if (typeof(opts.dismissWithOutsideClick) === 'undefined') {
    opts.dismissWithOutsideClick = true;
  }

  if (typeof(opts.dismissWithEscape) === 'undefined') {
    opts.dismissWithEscape = true;
  }

  var handler = function() {
    this.updateModalContext(componentName, opts);
  };

  return Ember.observer.apply(Ember, opts.withParams.concat(handler));
}

function currentParams(controller, paramNames) {
  var params={},
      foundNonDefault = false,
      proto = controller.constructor.proto(),
      name,
      value;

  for (var i = 0; i < paramNames.length; i++) {
    name = paramNames[i];
    value = controller.get(name);
    params[name] = value;
    if (value !== proto[name]) {
      foundNonDefault = true;
    }
  }
  if (foundNonDefault) {
    return params;
  }
}
