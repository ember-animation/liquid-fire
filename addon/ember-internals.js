/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.
 */

import Ember from "ember";
let emberRequire = Ember.__loader.require;
let usingGlimmer;

export function initialize() {
  let rendererModule;
  try {
    rendererModule = emberRequire('ember-glimmer/renderer');
    usingGlimmer = true;
  } catch(err)  {}

  if (usingGlimmer) {
    let declareDynamicVariable = rendererModule.declareDynamicVariable;
    if (!declareDynamicVariable) {
      throw new Error("to work with glimmer2, liquid-fire depends on changes in Ember that you don't have");
    }
    declareDynamicVariable('liquidParent');
  } else {
    registerKeywords();
  }
}

// Given an Ember Component, return the containing element
export function containingElement(view) {
  if (usingGlimmer) {
    // FIXME: this is not really the same thing
    return view.parentView.element;
  } else {
    return view._renderNode.contextualElement;
  }
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
  let r, c;
  if (routeInfo) {
    if (routeInfo.hasOwnProperty('_lf_model')) {
      return [ routeInfo._lf_model ];
    }
    if ((r = routeInfo.render) && (c = r.controller)) {
      return [ (routeInfo._lf_model = c.get('model')) ];
    }
  }
}

function registerKeywords() {
  throw new Error("haven't backported this branch onto pre-glimmer2 Ember");
}

export function getComponentFactory(owner, name) {
  let looker = owner.lookup('component-lookup:main');
  if (looker.lookupFactory) {
    return looker.lookupFactory(name);
  } else {
    let Component = looker.componentFor(name, owner);
    let layout = looker.layoutFor(name, owner);
    return (Component || Ember.Component).extend({ layout });
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
