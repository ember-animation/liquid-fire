import Ember from "ember";
import { Promise } from "liquid-fire";
import { currentTransform } from "liquid-fire/matrix";

// Explode is not, by itself, an animation. It exists to pull apart
// other elements so that each of the pieces can be targeted by
// animations.

export default function explode(...pieces) {
  var seenElements = {};
  var sawBackgroundPiece = false;
  var promises = pieces.map((piece) => {
    if (piece.matchBy) {
      return matchAndExplode(this, piece, seenElements);
    } else if (piece.pick || piece.pickOld || piece.pickNew){
      return explodePiece(this, piece, seenElements);
    } else {
      sawBackgroundPiece = true;
      return runAnimation(this, piece);
    }
  });
  if (!sawBackgroundPiece) {
    if (this.newElement) {
      this.newElement.css({visibility: ''});
    }
    if (this.oldElement) {
      this.oldElement.css({visibility: 'hidden'});
    }
  }
  return Promise.all(promises);
}

function explodePiece(context, piece, seen) {
  var childContext = Ember.copy(context);
  var selectors = [piece.pickOld || piece.pick, piece.pickNew || piece.pick];
  let preserve = piece.preserve || [];
  var cleanupOld, cleanupNew;

  if (selectors[0] || selectors[1]) {
    cleanupOld = _explodePart(context, 'oldElement', childContext, selectors[0], seen, preserve);
    cleanupNew = _explodePart(context, 'newElement', childContext, selectors[1], seen, preserve);
    if (!cleanupOld && !cleanupNew) {
      return Promise.resolve();
    }
  }

  return Promise.all([cleanupOld, cleanupNew]).then(([cleanupOld, cleanupNew]) => {
    return runAnimation(childContext, piece).finally(() => {
      if (cleanupOld) { cleanupOld(); }
      if (cleanupNew) { cleanupNew(); }
    });
  });
}

function clone(child, preserve) {
  let newChild = child.clone();
  for (let prop of preserve) {
    newChild.css(prop, child.css(prop));
  }
  return newChild;
}

function _explodePart(context, field, childContext, selector, seen, preserve) {
  var child;
  var elt = context[field];

  childContext[field] = null;
  if (elt && selector) {
    child = elt.find(selector).filter(function() {
      var guid = Ember.guidFor(this);
      if (!seen[guid]) {
        seen[guid] = true;
        return true;
      }
    });
    if (child.length > 0) {
      return _explodeChild(elt, child, childContext, field, preserve);
    }
  }
}

function _explodeChild(elt, child, childContext, field, preserve) {
  let childRect = child[0].getBoundingClientRect();
  let width = child.outerWidth();
  let height = child.outerHeight();
  let newChild = clone(child, preserve);

  // If the original element's parent was hidden, hide our clone
  // too.
  if (elt.css('visibility') === 'hidden') {
    newChild.css({ visibility: 'hidden' });
  }
  newChild.appendTo(elt.parent());
  newChild.outerWidth(width);
  newChild.outerHeight(height);
  var newParentRect = newChild.offsetParent()[0].getBoundingClientRect();
  let transform = currentTransform(child);
  transform.tx = childRect.left - newParentRect.left;
  transform.ty = childRect.top - newParentRect.top;
  newChild.css({
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 0,
    transform: transform.serialize(),
    transformOrigin: '0 0'
  });

  // Pass the clone to the next animation
  childContext[field] = newChild;

  return waitForElementLoading(newChild).then(() => {
    // Hide the original element
    child.css({visibility: 'hidden'});
    return function cleanup() {
      newChild.remove();
      child.css({visibility: ''});
    };
  });
}

function waitForElementLoading(newChild) {
  let selector = 'iframe';
  let elements = newChild.find(selector).add(newChild.filter(selector)).toArray();
  return Promise.all(
    elements.map(elt => new Promise(resolve => Ember.$(elt).on('load', resolve)))
  );
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

function runAnimation(context, piece) {
  return new Promise((resolve, reject) => {
    animationFor(context, piece).apply(context).then(resolve, reject);
  });
}

function matchAndExplode(context, piece, seen) {
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
    }, seen);
  }));
}
