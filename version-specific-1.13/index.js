import Ember from "ember";
let emberRequire = Ember.__loader.require;
let internal = emberRequire('htmlbars-runtime').internal;
let registerKeyword = emberRequire('ember-htmlbars/keywords').registerKeyword;
let _Stream = Ember.__loader.registry['ember-metal/streams/stream'] ? emberRequire('ember-metal/streams/stream') : emberRequire('ember-htmlbars/streams/stream');
let BasicStream = _Stream.default;
let Stream = _Stream.Stream;

// Given an Ember Component, return the containing element
export function containingElement(view) {
  return view._renderNode.contextualElement;
}

export function initialize() {
  registerKeyword('-get-outlet-state', {
    willRender(renderNode, env) {
      env.view.ownerView._outlets.push(renderNode);
    },

    setupState(lastState, env, scope, params, hash) {
      let watchModels = env.hooks.getValue(hash.watchModels);
      let stream = lastState.stream;
      let source = lastState.source;
      if (!stream) {
        source = { env };
        if (Stream) {
          stream = new Stream(function() {
            return { outlets: source.env.outletState };
          });
        } else {
          stream = new BasicStream(function() {
            return { outlets: source.env.outletState };
          });
        }
      }
      return { stream, source, watchModels };
    },

    render(renderNode, env, scope, params, hash, template, inverse, visitor) {
      internal.hostBlock(renderNode, env, scope, template, null, null, visitor, function(options) {
        let stream = renderNode.getState ? renderNode.getState().stream : renderNode.state.stream;
        options.templates.template.yield([stream]);
      });

    },
    rerender(morph, env) {
      let state = morph._state ? morph._state : morph.state;
      state.source.env = env ;
      state.stream.notify();
    },
    isStable() {
      return true;
    }
  });

  registerKeyword('-with-dynamic-vars', {
    setupState(state, env, scope, params, hash) {
      let keys = Object.keys(hash);
      if (keys.length > 1 || keys[0] !== 'outletState') {
        throw new Error("the -with-dynamic-vars polyfill in liquid-fire only handles outletState");
      }
      let outletState = env.hooks.getValue(hash.outletState);
      return { outletState };
    },

    childEnv(state, env) {
      return env.childWithOutletState(state.outletState ? state.outletState.outlets : {});
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

export { default as getOutletStateTemplate } from 'liquid-fire/templates/version-specific/get-outlet-state';
