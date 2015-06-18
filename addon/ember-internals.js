/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
*/

import Ember from "ember";
var get = Ember.get;
var set = Ember.set;

// Given an Ember.View, return the containing element
export function containingElement(view) {
  return view._morph.contextualElement;
}

// Create a helper that wraps one of our components. We mostly do this
// just to get position-argument syntax.
export function makeHelperShim(componentName, tweak) {
  return {
    isHTMLBars: true,
    helperFunction: function liquidFireHelper(params, hash, options, env) {
      var view = env.data.view;
      var componentLookup = view.container.lookup('component-lookup:main');
      var cls = componentLookup.lookupFactory(componentName);
      hash.value = params[0];
      if (hash['class']) {
        hash.innerClass = hash['class'];
        delete hash['class'];
      }
      if (hash.id) {
        hash.innerId = hash.id;
        delete hash.id;
      }
      hash.tagName = "";
      if (tweak) {
        tweak(params, hash, options, env);
      }
      env.helpers.view.helperFunction.call(view, [cls], hash, options, env);
    }
  };
}

// We use this as {{lf-yield-inverse}} to yield to our inverse
// template, for the {{else}} case in liquid-if and liquid-unless.
export function inverseYieldHelper(params, hash, options, env) {
  var view = env.data.view;

  while (view && !get(view, 'layout')) {
    if (view._contextView) {
      view = view._contextView;
    } else {
      view = view._parentView;
    }
  }

  return view._yieldInverse(env.data.view, env, options.morph, params);
}

// We add this method to our components to help implement lf-inverse-yield.
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

// This lets us hook into the outlet state.
export var OutletBehavior = {
  _isOutlet: true,

  init: function() {
    this._super();
    this._childOutlets = [];

    // Our outlet state is named differently than a normal ember
    // outlet ("_outletState"), so that our child outlets don't
    // automatically discover it. Instead we will always push state
    // down to them, so we can version it as we wish.
    this.outletState = null;
  },


  setOutletState: function(state) {
    if (state && state.render && state.render.controller && !state._lf_model) {
      // This is a hack to compensate for Ember 1.0's remaining use of
      // mutability within the route state -- the controller is a
      // singleton whose model will keep changing on us. By locking it
      // down the first time we see the state, we can more closely
      // emulate ember 2.0 semantics.
      //
      // The Ember 2.0 component attributes shouldn't suffer this
      // problem and we can eventually drop the hack.
      state = Ember.copy(state);
      state._lf_model = get(state.render.controller, 'model');
    }

    if (!this._diffState(state)) {
      var children = this._childOutlets;
      for (var i = 0 ; i < children.length; i++) {
        var child = children[i];
        child.setOutletState(state);
      }

    }
  },

  _diffState: function(state) {
    while (state && emptyRouteState(state)) {
      state = state.outlets.main;
    }
    var different = !sameRouteState(this.outletState, state);

    if (different) {
      set(this, 'outletState', state);
    }

    return different;
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
      if (parent._outletState && parent._outletState.outlets[this._outletName]) {
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

function emptyRouteState(state) {
  return !state.render.ViewClass && !state.render.template;
}

function sameRouteState(a, b) {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  a = a.render;
  b = b.render;
  for (var key in a) {
    if (a.hasOwnProperty(key)) {
      // name is only here for logging & debugging. If two different
      // names result in otherwise identical states, they're still
      // identical.
      if (a[key] !== b[key] && key !== 'name') {
        return false;
      }
    }
  }
  return true;
}

// This lets us invoke an outlet with an explicitly passed outlet
// state, rather than inheriting it implicitly from its context.
export var StaticOutlet = Ember.OutletView.superclass.extend({
  //tagName: '',

  setStaticState: Ember.on('init', Ember.observer('staticState', function() {
    this.setOutletState(this.get('staticState'));
  })),
  onWillDestroy: Ember.on('willDestroyElement', function(){
    this.$().removeData();
  })
});

// Finds the route name from a route state so we can apply our
// matching rules to it.
export function routeName(routeState) {
  if (routeState && routeState.render) {
    return [routeState.render.name];
  }
}

// Finds the route's model from a route state so we can apply our
// matching rules to it.
export function routeModel(routeState) {
  if (routeState) {
    return [routeState._lf_model];
  }
}
