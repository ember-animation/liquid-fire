// Wraps our calls to velocity.js so they always return a promise
// (there's a PR in velocity upstream to add native promise support).
//
// In general, our API uses promises over the built-in queues provided
// by animation libraries because promises are more composable and
// general purpose across animation methods.
export function animate(view, props, opts) {
  return new Promise(function(resolve) {
    if (!view) {
      resolve();
      return;
    }
    if (!opts) {
      opts = {};
    }
    opts.complete = resolve;
    view.$().velocity(props, opts);
  });
}


export function setDefaults(props) {
  /* global $ */
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      $.Velocity.defaults[key] = props[key];
    }
  }
}
