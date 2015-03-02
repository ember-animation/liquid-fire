import Ember from "ember";
import { Promise } from "liquid-fire";

// Explode is not, by itself, an animation. It exists to pull apart
// other elements so that each of the pieces can be targeted by
// animations.

export default function explode(...pieces) {
  return Promise.all(Ember.A(pieces).map((piece) => explodePiece(this, piece))).then(() => {
    // The default transition guarantees that we didn't leave our
    // original new element invisible
    this.lookup('default').apply(this);
  });
}

function explodePiece(context, piece) {
  var childContext = Ember.copy(context);
  var selectors = [piece.pick, piece.pick];
  var cleanupOld, cleanupNew;

  if (piece.pickOld) {
    selectors[0] = piece.pickOld;
  }
  if (piece.pickNew) {
    selectors[1] = piece.pickNew;
  }

  if (selectors[0]) {
    cleanupOld = _explodePart(context, 'oldElement', childContext, selectors[0]);
  }

  if (selectors[1]) {
    cleanupNew = _explodePart(context, 'newElement', childContext, selectors[1]);
  }

  return animationFor(context, piece).apply(childContext).then(() => {
    if (cleanupOld) { cleanupOld(); }
    if (cleanupNew) { cleanupNew(); }
  });
}

function _explodePart(context, field, childContext, selector) {
  var child, childOffset, newChild;
  var elt = context[field];
  childContext[field] = null;
  if (elt) {
    child = elt.find(selector);
    if (child.length > 0) {
      childOffset = child.offset();
      newChild = child.clone();

      // Hide the original element
      child.css({visibility: 'hidden'});

      // If the original element's parent was hidden, hide our clone
      // too.
      if (elt.css('visibility') === 'hidden') {
        newChild.css({ visibility: 'hidden' });
      }

      newChild.appendTo(elt.parent());
      newChild.offset(childOffset);

      // Pass the clone to the next animation
      childContext[field] = newChild;
      return function cleanup() {
        newChild.remove();
        child.css({visibility: ''});
      };
    }
  }
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
