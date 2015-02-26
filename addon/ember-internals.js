/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
*/

export function containingElement(view) {
  return view._morph.contextualElement;
}
