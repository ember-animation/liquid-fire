// Wraps our calls to velocity.js so they always return a promise
// (there's a PR in velocity upstream to add native promise support).
//
// In general, our API uses promises over the built-in queues provided
// by animation libraries because promises are more composable and
// general purpose across animation methods.
export function animate(view, props, opts) {
  return new Promise(function(resolve) {
    var elt;
    if (!view || !(elt = view.$())) {
      resolve();
      return;
    }
    if (!opts) {
      opts = {};
    }
    opts.complete = resolve;
    elt.velocity(props, opts);
  });
}

export function stop(view) {
  var elt;
  if (view && (elt = view.$())) {
    elt.velocity('stop', true);
  }
}

export function setDefaults(props) {
  /* global $ */
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      $.Velocity.defaults[key] = props[key];
    }
  }
}

