/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

import Ember from 'ember';

function focusable( element, isTabIndexNotNaN ) {
  var nodeName = element.nodeName.toLowerCase();
  return ( /input|select|textarea|button|object/.test( nodeName ) ?
    !element.disabled :
    "a" === nodeName ?
      element.href || isTabIndexNotNaN :
      isTabIndexNotNaN) && visible( element );
}

function visible(element) {
  var $el = Ember.$(element);
  return Ember.$.expr.filters.visible(element) &&
    !Ember.$($el, $el.parents()).filter(function() {
      return Ember.$.css( this, "visibility" ) === "hidden";
    }).length;
}

if (!Ember.$.expr[':'].tabbable) {
  Ember.$.expr[':'].tabbable = function( element ) {
    var tabIndex = Ember.$.attr( element, "tabindex" ),
      isTabIndexNaN = isNaN( tabIndex );
    return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
  };
}
