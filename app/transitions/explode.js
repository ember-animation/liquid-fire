import Ember from "ember";
import { Promise } from "liquid-fire";

// Explode is not, by itself, an animation. It exists to pull apart
// other elements so that each of the pieces can be targeted by
// animations.

export default function explode(...pieces) {
  var result = Promise.all(pieces.map((piece) => {
    if (piece.matchBy) {
      return matchAndExplode(this, piece);
    } else {
      return explodePiece(this, piece);
    }
  }));

  if (this.newElement) {
    this.newElement.css({visibility: ''});
  }
  if (this.oldElement) {
    this.oldElement.css({visibility: 'hidden'});
  }

  return result;
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

  // if we were trying to target specific selectors and didn't find
  // any matches, there's no transition to run (if there were no
  // selectors, we deliberately fall through an animate the underlying
  // "background" elements).
  if (!cleanupOld && !cleanupNew && (selectors[0] || selectors[1])) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    animationFor(context, piece).apply(childContext).then(resolve, reject);
  }).finally(() => {
    if (cleanupOld) { cleanupOld(); }
    if (cleanupNew) { cleanupNew(); }
  });
}

function _explodePart(context, field, childContext, selector) {
  var child, childOffset, width, height, newChild;
  var elt = context[field];
  childContext[field] = null;
  if (elt) {
    child = elt.find(selector);
    if (child.length > 0) {
      childOffset = child.offset();
      width = child.width();
      height = child.height();
      newChild = child.clone();

      // Hide the original element
      child.css({visibility: 'hidden'});

      // If the original element's parent was hidden, hide our clone
      // too.
      if (elt.css('visibility') === 'hidden') {
        newChild.css({ visibility: 'hidden' });
      }
      newChild.width(width);
      newChild.height(height);
      newChild.appendTo(elt.parent());
      var newParentOffset = newChild.offsetParent().offset();
      newChild.css({
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

function matchAndExplode(context, piece) {
  if (!context.oldElement) {
    return Promise.resolve();
  }

  var hits = Ember.A(context.oldElement.find(`[${piece.matchBy}]`).toArray());
  return Promise.all(hits.map((elt) => {
    return explodePiece(context, {
      pick: `[${piece.matchBy}=${Ember.$(elt).attr(piece.matchBy)}]`,
      use: piece.use
    });
  }));
}
