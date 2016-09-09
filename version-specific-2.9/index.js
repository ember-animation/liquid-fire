import Ember from 'ember';

const { getViewBounds } = Ember.ViewUtils;

export function initialize() { }

export function containingElement(view) {
  return getViewBounds(view).parentElement;
}

export { default as getOutletStateTemplate } from 'liquid-fire/templates/version-specific/get-outlet-state';
