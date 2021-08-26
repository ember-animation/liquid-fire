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

import $ from 'jquery';

function focusable(element, isTabIndexNotNaN) {
  let nodeName = element.nodeName.toLowerCase();
  return (
    (/input|select|textarea|button|object/.test(nodeName)
      ? !element.disabled
      : 'a' === nodeName
      ? element.href || isTabIndexNotNaN
      : isTabIndexNotNaN) && visible(element)
  );
}

function visible(element) {
  let $el = $(element);
  return (
    $.expr.filters.visible(element) &&
    !$($el, $el.parents()).filter(function () {
      return $.css(this, 'visibility') === 'hidden';
    }).length
  );
}

if (!$.expr[':'].tabbable) {
  $.expr[':'].tabbable = function (element) {
    let tabIndex = $.attr(element, 'tabindex'),
      isTabIndexNaN = isNaN(tabIndex);
    return (
      (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN)
    );
  };
}
