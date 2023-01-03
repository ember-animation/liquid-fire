/* jshint newcap: false */
import Promise from './promise';
import Velocity from 'velocity';

// Make sure Velocity always has promise support by injecting our own
// RSVP-based implementation if it doesn't already have one.
if (!Velocity.Promise) {
  Velocity.Promise = Promise;
}

// Velocity's tick() defaults to RAF's high resolution timestamp. If the browser
// is under high stress the RAF timestamp may have a significant offset which
// can result in dropping a large chunk of frames. Because of this, the use of
// the RAF timestamp should be opt-in.
Velocity.timestamp = false;

export function animate(elt, props, opts, label) {
  // These numbers are just sane defaults in the probably-impossible
  // case where somebody tries to read our state before the first
  // 'progress' callback has fired.
  let state = { percentComplete: 0, timeRemaining: 100, timeSpent: 0 };

  if (!elt) {
    return Promise.resolve();
  }

  if (!opts) {
    opts = {};
  } else {
    opts = { ...opts };
  }

  // By default, we ask velocity to clear the element's `display`
  // and `visibility` properties at the start of animation. Our
  // animated divs are all initially rendered with `display:none`
  // and `visibility:hidden` to prevent a flash of before-animated
  // content.
  if (typeof opts.display === 'undefined') {
    opts.display = '';
  }
  if (typeof opts.visibility === 'undefined') {
    opts.visibility = '';
  }

  if (opts.progress) {
    throw new Error(
      "liquid-fire's 'animate' function reserves the use of Velocity's 'progress' option for its own nefarious purposes."
    );
  }

  opts.progress = function () {
    state.percentComplete = arguments[1];
    state.timeRemaining = arguments[2];
    state.timeSpent = state.timeRemaining / (1 / state.percentComplete - 1);
  };

  state.promise = Promise.resolve(Velocity.animate(elt, props, opts));

  if (label) {
    state.promise = state.promise.then(
      function () {
        clearLabel(elt, label);
      },
      function (err) {
        clearLabel(elt, label);
        throw err;
      }
    );
    applyLabel(elt, label, state);
  }

  return state.promise;
}

export function stop(elt) {
  if (elt) {
    Velocity(elt, 'stop', true);
  }
}

export function setDefaults(props) {
  for (let key in props) {
    if (props.hasOwnProperty(key)) {
      if (key === 'progress') {
        throw new Error(
          "liquid-fire's 'animate' function reserves the use of Velocity's '" +
            key +
            "' option for its own nefarious purposes."
        );
      }
      Velocity.defaults[key] = props[key];
    }
  }
}

export function isAnimating(elt, animationLabel) {
  return elt && data(elt, 'lfTags_' + animationLabel);
}

export function finish(elt, animationLabel) {
  return stateForLabel(elt, animationLabel).promise;
}

export function timeSpent(elt, animationLabel) {
  return stateForLabel(elt, animationLabel).timeSpent;
}

export function timeRemaining(elt, animationLabel) {
  return stateForLabel(elt, animationLabel).timeRemaining;
}

function stateForLabel(elt, label) {
  let state = isAnimating(elt, label);
  if (!state) {
    throw new Error('no animation labeled ' + label + ' is in progress');
  }
  return state;
}

function applyLabel(elt, label, state) {
  if (elt) {
    data(elt, 'lfTags_' + label, state);
  }
}

function clearLabel(elt, label) {
  if (elt) {
    data(elt, 'lfTags_' + label, null);
  }
}

const DATA_STORAGE = {};

function data(obj, key, val) {
  if (!obj) {
    return DATA_STORAGE;
  } else if (!key) {
    if (!(obj in DATA_STORAGE)) {
      return {};
    }
    return DATA_STORAGE[obj];
  } else if (arguments.length < 3) {
    if (!(obj in DATA_STORAGE)) {
      return undefined;
    }
    return DATA_STORAGE[obj][key];
  } else {
    if (!(obj in DATA_STORAGE)) {
      DATA_STORAGE[obj] = {};
    }
    DATA_STORAGE[obj][key] = val;
  }
}
