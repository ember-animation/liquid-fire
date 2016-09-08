import Ember from 'ember';

const { getViewBounds } = Ember.ViewUtils;

export function initialize() { }

export function containingElement(view) {
  return getViewBounds(view).parentElement;
}
