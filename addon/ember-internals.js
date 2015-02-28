/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
*/

import Ember from "ember";
var get = Ember.get;

export function containingElement(view) {
  return view._morph.contextualElement;
}

export function makeHelperShim(componentName, tweak) {
  return {
    isHTMLBars: true,
    helperFunction: function liquidFireHelper(params, hash, options, env) {
      var componentLookup = this.container.lookup('component-lookup:main');
      var cls = componentLookup.lookupFactory(componentName);
      hash.value = params[0];
      if (hash['class']) {
        hash.innerClass = hash['class'];
        delete hash['class'];
      }
      hash.tagName = "";
      if (tweak) {
        tweak(params, hash, options, env);
      }
      env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
    }
  };
}

export function inverseYieldHelper(params, hash, options, env) {
  var view = this;

  while (view && !get(view, 'layout')) {
    if (view._contextView) {
      view = view._contextView;
    } else {
      view = view._parentView;
    }
  }

  return view._yieldInverse(this, env, options.morph, params);
}

export function inverseYieldMethod(context, options, morph, blockArguments) {
  var view = options.data.view;
  var parentView = this._parentView;
  var template = get(this, 'inverseTemplate');

  if (template) {
    view.appendChild(Ember.View, {
      isVirtual: true,
      tagName: '',
      template: template,
      _blockArguments: blockArguments,
      _contextView: parentView,
      _morph: morph,
      context: get(parentView, 'context'),
      controller: get(parentView, 'controller')
    });
  }
}

export var OutletBehavior = {
  _isOutlet: true,

  setOutletState: function(state) {
    this.set('outletState', state);
  },

  _parentOutlet: function() {
    var parent = this._parentView;
    while (parent && !parent._isOutlet) {
      parent = parent._parentView;
    }
    return parent;
  },

  _linkParent: Ember.on('init', 'parentViewDidChange', function() {
    var parent = this._parentOutlet();
    if (parent) {
      this._parentOutletLink = parent;
      parent._childOutlets.push(this);
      if (parent._outletState) {
        this.setOutletState(parent._outletState.outlets[this._outletName]);
      }
    }
  }),

  willDestroy: function() {
    if (this._parentOutletLink) {
      this._parentOutletLink._childOutlets.removeObject(this);
    }
    this._super();
  }
};

export var StaticOutlet = Ember.OutletView.superclass.extend({
  tagName: '',

  // Disable normal outletstate propagation
  _parentOutlet: function() {},

  setStaticState: Ember.on('init', Ember.observer('staticState', function() {
    this.setOutletState(this.get('staticState'));
  }))
});
