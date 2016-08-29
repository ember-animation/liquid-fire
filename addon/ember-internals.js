/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.

  See also tests/helpers/ember-testing-internals.js, which does the
  same thing but for code that is only needed in the test environment.
 */

import Ember from "ember";
let emberRequire = Ember.__loader.require;
export let getViewBounds;

export function initialize() {
  try {
    emberRequire('ember-glimmer');
  } catch(err)  {
    throw new Error("this build of liquid-fire only works with glimmer2");
  }
  getViewBounds = emberRequire('ember-views/system/utils').getViewBounds;
}

// Given an Ember Component, return the containing element
export function containingElement(view) {
  return getViewBounds(view).parentElement;
}

// Traverses down to the child routeInfo with the given name.
export function childRoute(routeInfo, outletName) {
  let outlets;
  // TODO: the second condition is only necessary because every
  // constrainable accessor runs against every value all the time. It
  // would be better to add a precondition on helperName that would
  // short-circuit this elsewhere.
  if (routeInfo && (outlets = routeInfo.outlets)) {
    return outlets[outletName];
  }
}

// Finds the route name from a route state so we can apply our
// matching rules to it.
export function routeName(routeInfo) {
  if (routeInfo) {
    return [routeInfo.render.name];
  }
}

// Finds the route's model from a route state so we can apply our
// matching rules to it. On first access, will lock down the value of
// the model so that future changes don't change the answer. This lets
// us avoid the problem of singleton controllers changing underneath
// us.
export function routeModel(routeInfo) {
  if (routeInfo && !routeInfo.hasOwnProperty('_lf_model')) {
    let r, c;
    if ((r = routeInfo.render) && (c = r.controller)) {
      routeInfo._lf_model = Ember.get(c, 'model');
    } else {
      routeInfo._lf_model = null;
    }
  }

  if (routeInfo) {
    return [routeInfo._lf_model];
  } else {
    return [];
  }
}

export function routeIsStable(oldRouteInfo, newRouteInfo) {
  if (!oldRouteInfo && !newRouteInfo) {
    return true;
  }

  if (!oldRouteInfo || !newRouteInfo) {
    return false;
  }

  return oldRouteInfo.render.template === newRouteInfo.render.template &&
    oldRouteInfo.render.controller === newRouteInfo.render.controller;
}

// Only valid for states that already satisfy routeIsStable
export function modelIsStable(oldRouteInfo, newRouteInfo) {
  let oldModel = routeModel(oldRouteInfo) || [];
  let newModel = routeModel(newRouteInfo) || [];
  return  oldModel[0] === newModel[0];
}
