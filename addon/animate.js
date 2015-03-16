import Promise from "./promise";
import Ember from "ember";

var Velocity = Ember.$.Velocity;

// Make sure Velocity always has promise support by injecting our own
// RSVP-based implementation if it doesn't already have one.
if (!Velocity.Promise) {
  Velocity.Promise = Promise;
}

export function animate(elt, props, opts, label) {
  // These numbers are just sane defaults in the probably-impossible
  // case where somebody tries to read our state before the first
  // 'progress' callback has fired.
  var state = { percentComplete: 0, timeRemaining: 100, timeSpent: 0 };

  if (!elt || elt.length === 0) {
    return Promise.resolve();
  }

  if (!opts) {
    opts = {};
  } else {
    opts = Ember.copy(opts);
  }

  // By default, we ask velocity to clear the element's `display`
  // and `visibility` properties at the start of animation. Our
  // animated divs are all initially rendered with `display:none`
  // and `visibility:hidden` to prevent a flash of before-animated
  // content.
  if (typeof(opts.display) === 'undefined') {
    opts.display = '';
  }
  if (typeof(opts.visibility) === 'undefined') {
    opts.visibility = 'visible';
  }

  if (opts.progress) {
    throw new Error("liquid-fire's 'animate' function reserves the use of Velocity's 'progress' option for its own nefarious purposes.");
  }

  opts.progress = function(){
    state.percentComplete = arguments[1];
    state.timeRemaining = arguments[2];
    state.timeSpent = state.timeRemaining / (1/state.percentComplete - 1);
  };

  // Apply '.liquid-animating' to liquid-container allowing
  // any customizable CSS control while an animating is occuring
  applyAnimatingClass(elt[0]);

  state.promise = Promise.resolve(Velocity.animate(elt[0], props, opts));

  if (label) {
    state.promise = state.promise.then(function(){
      clearAnimatingClass(elt[0]);
      clearLabel(elt, label);
    }, function(err) {
      clearAnimatingClass(elt[0]);
      clearLabel(elt, label);
      throw err;
    });
    applyLabel(elt, label, state);
  }

  return state.promise;
}

export function stop(elt) {
  if (elt) {
    elt.velocity('stop', true);
  }
}

export function setDefaults(props) {
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      if (key === 'progress') {
        throw new Error("liquid-fire's 'animate' function reserves the use of Velocity's '" + key + "' option for its own nefarious purposes.");
      }
      Velocity.defaults[key] = props[key];
    }
  }
}

export function isAnimating(elt, animationLabel) {
  return elt && elt.data('lfTags_' + animationLabel);
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
  var state = isAnimating(elt, label);
  if (!state) {
    throw new Error("no animation labeled " + label + " is in progress");
  }
  return state;
}

function applyLabel(elt, label, state) {
  if (elt){
    elt.data('lfTags_' + label, state);
  }
}

function clearLabel(elt, label) {
  if (elt) {
    elt.data('lfTags_' + label, null);
  }
}

function applyAnimatingClass(element) {
  var parentContainer = element.parentNode,
      existingClasses = parentContainer.className.split(/\s+/),
      hasAnimatingClass = false;

  for (var i=0; i<existingClasses.length; i++) {
    if (existingClasses[i] === 'liquid-animating') {
      hasAnimatingClass = true;
      break;
    }
  }
  if (!hasAnimatingClass) {
    parentContainer.className += ' liquid-animating';
  }
}

function clearAnimatingClass(element) {
  var parentContainer = element.parentNode;

  parentContainer.className =
    parentContainer.className.replace(/\b liquid-animating\b/, '');
}
