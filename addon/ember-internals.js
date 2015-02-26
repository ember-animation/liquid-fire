/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
*/

export function containingElement(view) {
  return view._morph.contextualElement;
}

export function makeHelperShim(componentName) {
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
      env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
    }
  };
}
