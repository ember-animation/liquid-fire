/* global $ */
import Promise from "./promise";

// Make sure Velocity always has promise support by injecting our own
// RSVP-based implementation if it doesn't already have one.
if (!$.Velocity.Promise) {
  $.Velocity.Promise = Promise;
}

export function animate(view, props, opts, label) {
  var elt, promise;

  if (!view || !(elt = view.$()) || !elt[0]) {
    return Promise.cast();
  }

  if (!opts) {  opts = {}; }

  // By default, we ask velocity to reveal the elements at the start
  // of animation. Our animated divs are all initially rendered at
  // display:none to prevent a flash of before-animated content.
  //
  // At present, velocity's 'auto' just picks a value for the css
  // display property based on the element type. I have a PR that
  // would let it defer to the stylesheets instead.
  if (typeof(opts.display) === 'undefined') {
    opts.display = 'auto';
  }

  promise = $.Velocity.animate(elt[0], props, opts);

  if (label) {
    promise = promise.then(function(){
      clearLabel(view, label);
    }, function(err) {
      clearLabel(view, label);
      throw err;
    });
    applyLabel(view, label, promise);
  }

  return promise;
}

export function stop(view) {
  var elt;
  if (view && (elt = view.$())) {
    elt.velocity('stop', true);
  }
}

export function setDefaults(props) {
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      $.Velocity.defaults[key] = props[key];
    }
  }
}

export function isAnimating(view, animationLabel) {
  return view && view._lfTags && view._lfTags[animationLabel];
}

export function finish(view, animationLabel) {
  var promise = isAnimating(view, animationLabel);
  if (!promise) {
    throw new Error("no animation labeled " + animationLabel + " is in progress");
  }
  return promise;
}

function applyLabel(view, label, promise) {
  if (!view){ return; }
  if (!view._lfTags) {
    view._lfTags = {};
  }
  view._lfTags[label] = promise;
}

function clearLabel(view, label) {
  if (view && view._lfTags) {
    delete view._lfTags[label];
  }
}
