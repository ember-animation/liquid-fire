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
