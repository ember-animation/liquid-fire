/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
*/

import Ember from "ember";
var get = Ember.get;

// Given an Ember.View, return the containing element
export function containingElement(view) {
  return view.renderNode.contextualElement;
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


// Finds the route name from a route state so we can apply our
// matching rules to it.
export function routeName(routeDesc) {
  if (routeDesc && routeDesc.state && routeDesc.state[routeDesc.name]) {
    return [routeDesc.state[routeDesc.name].render.name];
  }
}

// Finds the route's model from a route state so we can apply our
// matching rules to it.
export function routeModel(routeState) {
  if (routeState) {
    return [routeState._lf_model];
  }
}

var internal = Ember.__loader.require('htmlbars-runtime').internal;
var registerKeyword = Ember.__loader.require('ember-htmlbars/keywords').registerKeyword;
var o_create = Ember.__loader.require('ember-metal/platform/create').default;

export function registerKeywords() {
  registerKeyword('get-outlet-state', {
    willRender(renderNode, env) {
      env.view.ownerView._outlets.push(renderNode);
    },

    setupState(state, env) {
      return { value: env.outletState };
    },

    render(renderNode, env, scope, params, hash, template, inverse, visitor) {
      internal.hostBlock(renderNode, env, scope, template, null, null, visitor, function(options) {
        options.templates.template.yield([renderNode.state.value]);
      });
    }
  });

  registerKeyword('set-outlet-state', {
    setupState(state, env, scope, params) {
      return {
        outletState: env.hooks.getValue(params[0])
      };
    },

    childEnv(state) {
      return { outletState: state.outletState };
    },

    render(renderNode, env, scope, params, hash, template, inverse, visitor) {
      internal.hostBlock(renderNode, env, scope, template, null, null, visitor, function(options) {
        options.templates.template.yield();
      });
    }

  });
}
