import Ember from 'ember';
let getViewBounds;

export function initialize() {
  let emberRequire = Ember.__loader.require;
  getViewBounds = emberRequire('ember-views/system/utils').getViewBounds;
}

export function containingElement(view) {
  return getViewBounds(view).parentElement;
}
