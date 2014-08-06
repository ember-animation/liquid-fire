/* global $ */
import Promise from "./promise";

// Make sure Velocity always has promise support by injecting our own
// RSVP-based implementation if it doesn't already have one.
if (!$.Velocity.Promise) {
  $.Velocity.Promise = Promise;
}

export function animate(view, props, opts) {
  var elt;

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

  return $.Velocity.animate(elt[0], props, opts);
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
