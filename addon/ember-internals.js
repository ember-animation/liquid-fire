/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
*/

import Ember from "ember";
var get = Ember.get;

// Given an Ember.View, return the containing element
export function containingElement(view) {
  return view._renderNode.contextualElement;
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
export function routeName(routeIdentity) {
  var o, r;
  if (routeIdentity && (o = routeIdentity.outletState) && (r = o.render)) {
    return [ r.name ];
  }
}

// Finds the route's model from a route state so we can apply our
// matching rules to it.
export function routeModel(routeState) {
  if (routeState) {
    return [routeState._lf_model];
  }
}

var require = Ember.__loader.require;
var internal = require('htmlbars-runtime').internal;
var registerKeyword = require('ember-htmlbars/keywords').registerKeyword;
var Stream = require('ember-metal/streams/stream').default;
var isStable = require('ember-htmlbars/keywords/real_outlet').default.isStable;

export function registerKeywords() {
  registerKeyword('get-outlet-state', {
    willRender(renderNode, env) {
      env.view.ownerView._outlets.push(renderNode);
    },

    setupState(lastState, env, scope, params) {
      var outletName = env.hooks.getValue(params[0]);
      var stream = lastState.stream;
      var source = lastState.source;
      if (!stream) {
        source = { identity: { outletState: env.outletState[outletName] } };
        stream = new Stream(function() {
          return source.identity;
        });
      }
      return { stream, source, outletName };
    },

    render(renderNode, env, scope, params, hash, template, inverse, visitor) {
      internal.hostBlock(renderNode, env, scope, template, null, null, visitor, function(options) {
        options.templates.template.yield([renderNode.state.stream]);
      });

    },
    rerender(morph, env) {
      var newState = env.outletState[morph.state.outletName];
      if (isStable(morph.state.source.identity, { outletState: newState })) {
        // If our own view was stable, we preserve the same object
        // identity so that liquid-versions will not animate us. But
        // we still need to propagate any child changes forward.
        Ember.set(morph.state.source.identity, 'outletState', newState);
      } else {
        // If our own view has changed, we present a whole new object,
        // so that liquid-versions will see the change.
        morph.state.source.identity = { outletState: newState };
      }
      morph.state.stream.notify();
    },
    isStable() {
      return true;
    }
  });

  registerKeyword('set-outlet-state', {
    setupState(state, env, scope, params) {
      var outletName = env.hooks.getValue(params[0]);
      var outletState = env.hooks.getValue(params[1]);
      return { outletState: { [ outletName ] : outletState }};
    },

    childEnv(state) {
      return { outletState: state.outletState };
    },

    render(renderNode, env, scope, params, hash, template, inverse, visitor) {
      internal.hostBlock(renderNode, env, scope, template, null, null, visitor, function(options) {
        options.templates.template.yield();
      });
    },

    isStable() {
      return true;
    }
  });
}
