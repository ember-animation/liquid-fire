import $ from 'jquery';
import { isArray, A } from '@ember/array';
import { guidFor } from '@ember/object/internals';
import { Promise } from 'liquid-fire';

// Explode is not, by itself, an animation. It exists to pull apart
// other elements so that each of the pieces can be targeted by
// animations.

let deduplicateChildElementIds = (parentElem) => {
  if (!parentElem) {
    return;
  }

  let parentEl = parentElem[0];
  if (parentEl.id) {
    parentEl.setAttribute('id', `${guidFor(parentEl)}-${parentEl.id}`);
  }

  let childrenWithUniqueIds = parentEl.querySelectorAll('[id]');
  if (childrenWithUniqueIds.length) {
    for (let el of childrenWithUniqueIds) {
      el.setAttribute('id', `${guidFor(el)}-${el.id}`);
    }
  }
};

export default function explode(...pieces) {
  let seenElements = {};
  let sawBackgroundPiece = false;
  let promises = pieces.map((piece) => {
    if (piece.matchBy) {
      return matchAndExplode(this, piece, seenElements);
    } else if (piece.pick || piece.pickOld || piece.pickNew) {
      return explodePiece(this, piece, seenElements);
    } else {
      sawBackgroundPiece = true;
      return runAnimation(this, piece);
    }
  });
  if (!sawBackgroundPiece) {
    if (this.newElement) {
      this.newElement.css({ visibility: '' });
    }
    if (this.oldElement) {
      this.oldElement.css({ visibility: 'hidden' });
    }
  }
  return Promise.all(promises);
}

function explodePiece(context, piece, seen) {
  let childContext = { ...context };
  let selectors = [piece.pickOld || piece.pick, piece.pickNew || piece.pick];
  let cleanupOld, cleanupNew;

  if (selectors[0] || selectors[1]) {
    cleanupOld = _explodePart(
      context,
      'oldElement',
      childContext,
      selectors[0],
      seen
    );
    cleanupNew = _explodePart(
      context,
      'newElement',
      childContext,
      selectors[1],
      seen
    );
    if (!cleanupOld && !cleanupNew) {
      return Promise.resolve();
    }
  }

  return runAnimation(childContext, piece).finally(() => {
    if (cleanupOld) {
      cleanupOld();
    }
    if (cleanupNew) {
      cleanupNew();
    }
  });
}

function _explodePart(context, field, childContext, selector, seen) {
  let child, childOffset, width, height, newChild;
  let elt = context[field];

  childContext[field] = null;
  if (elt && selector) {
    child = elt.find(selector).filter(function () {
      let guid = guidFor(this);
      if (!seen[guid]) {
        seen[guid] = true;
        return true;
      }
    });
    if (child.length > 0) {
      childOffset = child.offset();
      width = child.outerWidth();
      height = child.outerHeight();
      newChild = child.clone();

      deduplicateChildElementIds(newChild);

      // Hide the original element
      child.css({ visibility: 'hidden' });

      // If the original element's parent was hidden, hide our clone
      // too.
      if (elt.css('visibility') === 'hidden') {
        newChild.css({ visibility: 'hidden' });
      }
      newChild.appendTo(elt.parent());
      newChild.outerWidth(width);
      newChild.outerHeight(height);
      let newParentOffset = newChild.offsetParent().offset();
      newChild.css({
        position: 'absolute',
        top: childOffset.top - newParentOffset.top,
        left: childOffset.left - newParentOffset.left,
        margin: 0,
      });

      // Pass the clone to the next animation
      childContext[field] = newChild;
      return function cleanup() {
        newChild.remove();
        child.css({ visibility: '' });
      };
    }
  }
}

function animationFor(context, piece) {
  let name, args, func;
  if (!piece.use) {
    throw new Error(
      "every argument to the 'explode' animation must include a followup animation to 'use'"
    );
  }
  if (isArray(piece.use)) {
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
  return function () {
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
  let selector;

  if (piece.matchBy === 'id') {
    selector = (attrValue) => {
      return `#${attrValue}`;
    };
  } else if (piece.matchBy === 'class') {
    selector = (attrValue) => {
      return `.${attrValue}`;
    };
  } else {
    selector = (attrValue) => {
      let escapedAttrValue = attrValue.replace(/'/g, "\\'");
      return `[${piece.matchBy}='${escapedAttrValue}']`;
    };
  }

  let hits = A(context.oldElement.find(`[${piece.matchBy}]`).toArray());
  return Promise.all(
    hits.map((elt) => {
      let attrValue = $(elt).attr(piece.matchBy);

      // if there is no match for a particular item just skip it
      if (
        attrValue === '' ||
        context.newElement.find(selector(attrValue)).length === 0
      ) {
        return Promise.resolve();
      }

      return explodePiece(
        context,
        {
          pick: selector(attrValue),
          use: piece.use,
        },
        seen
      );
    })
  );
}
