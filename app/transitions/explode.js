import Ember from "ember";
import { Promise } from "liquid-fire";

// Explode is not, by itself, an animation. It exists to pull apart
// other elements so that each of the pieces can be targeted by
// animations.

export default function explode(...pieces) {
  var promises = [];
  var childContext;
  var keepingSelf = false;

  for (var i = 0; i < pieces.length; i++) {
    var piece = pieces[i];
    if (piece.pick) {
      childContext = Ember.copy(this);
      _explodePart(this, 'newElement', childContext, piece);
      _explodePart(this, 'oldElement', childContext, piece);
    } else {
      keepingSelf = true;
      childContext = this;
    }
    promises.push(animationFor(this, piece).apply(childContext));
  }

  // If our original top-level elements are not getting passed onward
  // for more animation, mark them as visible so their children can
  // reveal themselves independently.
  if (!keepingSelf) {
    if (this.newElement) {
      this.newElement.css({visibility: ''});
    }
    if (this.oldElement) {
      this.oldElement.css({visibility: ''});
    }
  }
  return Promise.all(promises);
}

function _explodePart(context, field, childContext, piece) {
  var child, childOffset, newChild;
  var elt = context[field];
  childContext[field] = null;
  if (elt) {
    child = elt.find(piece.pick);
    if (child.length > 0) {
      if (piece.hoist) {
        childOffset = child.offset();
        newChild = child.clone();

        // Hide the original element
        child.css({visibility: 'hidden'});
      } else {
        newChild = child;
      }

      // If the original element's parent was hidden, hide our clone
      // too.
      if (elt.css('visibility') === 'hidden') {
        newChild.css({ visibility: 'hidden' });
      }

      if (piece.hoise) {
        newChild.appendTo(elt.parent());
        newChild.offset(childOffset);
      }

      // Pass the clone to the next animation
      childContext[field] = newChild;
    }
  }
  return childContext;
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
  func = context.lookup(name);
  return function() {
    return func.apply(this, args);
  };
}
