/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
 */

import Ember from "ember";
var emberRequire = Ember.__loader.require;
var internal = emberRequire('htmlbars-runtime').internal;
var registerKeyword = emberRequire('ember-htmlbars/keywords').registerKeyword;
var legacyViewKeyword = emberRequire('ember-htmlbars/keywords/view').default;
var _Stream = emberRequire('ember-metal/streams/stream');
var BasicStream = _Stream.default;
var Stream = _Stream.Stream;

var isStable;
try {
  isStable = emberRequire('ember-htmlbars/keywords/real_outlet').default.isStable;
} catch (err) {
  isStable = emberRequire('ember-htmlbars/keywords/outlet').default.isStable;
}

// Given an Ember Component, return the containing element
export function containingElement(view) {
  return view._renderNode.contextualElement;
}

// This is Ember's {{#if}} predicate semantics (where empty lists
// count as false, etc).
export var shouldDisplay = emberRequire('ember-views/streams/should_display').default;

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
export function routeModel(routeIdentity) {
  var o;
  if (routeIdentity && (o = routeIdentity.outletState)) {
    return [ o._lf_model ];
  }
}

function withLockedModel(outletState) {
  var r, c;
  if (outletState && (r = outletState.render) && (c = r.controller) && !outletState._lf_model) {
    outletState = Ember.copy(outletState);
    outletState._lf_model = c.get('model');
  }
  return outletState;
}

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
        source = { identity: {
            outletState: withLockedModel(env.outletState[outletName])
        }};

        if (!!Stream) {
          stream = new Stream(function() {
            return source.identity;
          });
        } else {
          stream = new BasicStream(function() {
            return source.identity;
          });
        }
      }
      return { stream, source, outletName };
    },

    render(renderNode, env, scope, params, hash, template, inverse, visitor) {
      internal.hostBlock(renderNode, env, scope, template, null, null, visitor, function(options) {
        var stream = renderNode.getState ? renderNode.getState().stream : renderNode.state.stream;
        options.templates.template.yield([stream]);
      });

    },
    rerender(morph, env) {
      var state = morph._state ? morph._state : morph.state;
      var newState = withLockedModel(env.outletState[state.outletName]);

      if (isStable(state.source.identity, { outletState: newState })) {
        // If our own view was stable, we preserve the same object
        // identity so that liquid-versions will not animate us. But
        // we still need to propagate any child changes forward.
        Ember.set(state.source.identity, 'outletState', newState);
      } else {
        // If our own view has changed, we present a whole new object,
        // so that liquid-versions will see the change.
        state.source.identity = { outletState: newState };
      }

      state.stream.notify();
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

    childEnv(state, env) {
      return env.childWithOutletState(state.outletState);
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

  // This gives us a non-deprecated view keyword so we can continue to
  // ship the old liquid-modal template for now without breaking
  // people's apps. liquid-modal itself is deprecated and will ship in
  // 1.13 but not 2.0.
  registerKeyword('lf-vue', legacyViewKeyword);
}
