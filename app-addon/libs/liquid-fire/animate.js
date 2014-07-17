import Promise from "./promise";

// Wraps our calls to velocity.js so they always return a promise
// (there's a PR in velocity upstream to add native promise support --
// once that's ready we can eliminate a lot of this).
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

    // This is needed for now because velocity doesn't have a callback
    // that fires after `stop`.
    if (!view._velocityAnimations) {
      view._velocityAnimations = [];
    }
    view._velocityAnimations.push(resolve);

    opts.begin = function(elements){
      for (var i=0; i<elements.length; i++) {
        elements[i].style.display = "";
      }
    }

    opts.complete = function(){
      var i = view._velocityAnimations.indexOf(resolve);
      if (i >=0 ) {
        view._velocityAnimations.splice(i, 1);
      }
      resolve();
    };
    elt.velocity(props, opts);
  });
}

export function stop(view) {
  var elt, animList;
  if (view && (elt = view.$())) {
    elt.velocity('stop', true);
    if (animList = view._velocityAnimations) {
      for (var i=0; i < animList.length; i++) {
        animList[i]();
      }
      view._velocityAnimations = [];
    }
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
