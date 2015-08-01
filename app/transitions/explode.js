import Ember from "ember";
import { Promise, inNextFrame } from "liquid-fire";

// Explode is not, by itself, an animation. It exists to pull apart
// other elements so that each of the pieces can be targeted by
// animations.

export default function explode(...pieces) {
  this._seenElements = {};
  var sawBackgroundPiece = false;
  var promises = pieces.map((piece) => {
    if (piece.matchBy) {
      return matchAndExplode(this, piece);
    } else if (piece.pick || piece.pickOld || piece.pickNew){
      return explodePiece(this, piece);
    } else {
      sawBackgroundPiece = true;
      return runAnimation(this, piece);
    }
  });
  if (!sawBackgroundPiece) {
    promises.push(inNextFrame(() => {
      if (this.newElement) {
        this.newElement.css({visibility: ''});
      }
      if (this.oldElement) {
        this.oldElement.css({visibility: 'hidden'});
      }
    }));
  }
  return Promise.all(promises);
}

// Handles one of the users configuration pieces
function explodePiece(context, piece) {
  var childContext = Ember.copy(context);
  var selectors = [piece.pickOld || piece.pick, piece.pickNew || piece.pick];
  let preserve = piece.preserve || [];

  return Promise.all(['oldElement', 'newElement'].map(
    (whichElement, index) =>
      _explodePart(context, whichElement, childContext, selectors[index], preserve)
  ).filter(p => p)).then((cleanups) => {
    cleanups = cleanups.filter(c => c);
    if (cleanups.length === 0) {
      return Promise.resolve();
    }
    return runAnimation(childContext, piece).finally(() => {
      for (let cleanup of cleanups) {
        if (cleanup) {
          cleanup();
        }
      }
    });
  });
}

function clone(child, preserve) {
  let newChild = child.clone();
  for (let prop of preserve) {
    // these writes dont force layout because the clone is not in DOM yet
    newChild.css(prop, child.css(prop));
  }
  return newChild;
}

// Handles half of one configuration piece (either oldElement or newElement)
function _explodePart(context, field, childContext, selector, preserve) {
  var elt = context[field];
  childContext[field] = null;
  if (elt && selector) {
    let seen = context._seenElements;
    let child = elt.find(selector).filter(function() {
      var guid = Ember.guidFor(this);
      if (!seen[guid]) {
        seen[guid] = true;
        return true;
      }
    });
    if (child.length > 0) {
      return _explodeChild(field, elt, child, childContext, preserve);
    }
  }
  return Promise.resolve();
}

// Implements the actual manipulation of a found child element
function _explodeChild(field, elt, child, childContext, preserve) {
  let childOffset = child.offset();
  let width = child.outerWidth();
  let height = child.outerHeight();
  let newChild = clone(child, preserve);

  // If the original element's parent was hidden, hide our clone
  // too.
  if (elt.css('visibility') === 'hidden') {
    // this is not a forced layout because newChild is not in DOM yet
    newChild.css({ visibility: 'hidden' });
  }

  let newParentOffset = elt.offsetParent().offset();

  // Here we're cutting over from reading to writing DOM, so we put in
  // a frame barrier so that all other parallel reads will finish
  // before we start writing.
  return inNextFrame(() => {
    // Hide the original element
    child.css({visibility: 'hidden'}); // write!

    newChild.appendTo(elt.parent()); //write
    newChild.outerWidth(width); //write
    newChild.outerHeight(height); //write


    newChild.css({ // write
      position: 'absolute',
      top: childOffset.top - newParentOffset.top,
      left: childOffset.left - newParentOffset.left,
      margin: 0
    });

    // Pass the clone to the next animation
    childContext[field] = newChild;
    return function cleanup() {
      newChild.remove();
      child.css({visibility: ''});
    };
  });
}

function animationFor(context, piece) {
  var name, args, func;
  if (!piece.use) {
    throw new Error("every argument to the 'explode' animation must include a followup animation to 'use'");
  }
  if (Ember.isArray(piece.use) ) {
    name = piece.use[0];
    args = piece.use.slice(1);
  } else {
    name = piece.use;
    args = [];
  }
  if (typeof name === 'function') {
    func = name;
  } else {
    func = context.lookup(name);
  }
  return function() {
    return Promise.resolve(func.apply(this, args));
  };
}

// maybe wait for writes to flush
function runAnimation(context, piece) {
  return new Promise((resolve, reject) => {
    animationFor(context, piece).apply(context).then(resolve, reject);
  });
}

function matchAndExplode(context, piece) {
  if (!context.oldElement || !context.newElement) {
    return Promise.resolve();
  }

  // reduce the matchBy scope
  if (piece.pick) {
    context.oldElement = context.oldElement.find(piece.pick);
    context.newElement = context.newElement.find(piece.pick);
  }

  if (piece.pickOld) {
    context.oldElement = context.oldElement.find(piece.pickOld);
  }

  if (piece.pickNew) {
    context.newElement = context.newElement.find(piece.pickNew);
  }

  // use the fastest selector available
  var selector;

  if (piece.matchBy === 'id') {
    selector = (attrValue) => { return `#${attrValue}`; };
  } else if (piece.matchBy === 'class') {
    selector = (attrValue) => { return `.${attrValue}`; };
  } else {
    selector = (attrValue) => {
      var escapedAttrValue = attrValue.replace(/'/g, "\\'");
      return `[${piece.matchBy}='${escapedAttrValue}']`;
    };
  }

  var hits = Ember.A(context.oldElement.find(`[${piece.matchBy}]`).toArray());
  return Promise.all(hits.map((elt) => {
    var attrValue = Ember.$(elt).attr(piece.matchBy);

    // if there is no match for a particular item just skip it
    if (attrValue === "" || context.newElement.find(selector(attrValue)).length === 0) {
      return Promise.resolve();
    }

    return explodePiece(context, {
      pick: selector(attrValue),
      use: piece.use,
      preserve: piece.preserve
    });
  }));
}
