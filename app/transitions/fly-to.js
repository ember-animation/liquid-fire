import { animate, Promise } from "liquid-fire";
import { currentTransform } from 'liquid-fire/matrix';

export default function flyTo(opts={}) {
  if (!this.newElement) {
    return Promise.resolve();
  } else if (!this.oldElement) {
    this.newElement.css({visibility: ''});
    return Promise.resolve();
  }

  var oldRect = this.oldElement[0].getBoundingClientRect();
  var newRect = this.newElement[0].getBoundingClientRect();

  var relativeTranslateX = newRect.left - oldRect.left;
  var relativeTranslateY = newRect.top - oldRect.top;
  var relativeScaleX = (newRect.right - newRect.left) / (oldRect.right - oldRect.left);
  var relativeScaleY = (newRect.bottom - newRect.top) / ( oldRect.bottom - oldRect.top);

  if (opts.movingSide === 'new') {
    let initialTransform = currentTransform(this.newElement);
    let motion = {
      translateX: [initialTransform.tx, initialTransform.tx - relativeTranslateX],
      translateY: [initialTransform.ty, initialTransform.ty - relativeTranslateY],
      scaleX: [ initialTransform.a, initialTransform.a / relativeScaleX],
      scaleY: [ initialTransform.d, initialTransform.d / relativeScaleY]
    };
    this.oldElement.css({ visibility: 'hidden' });
    // the currentTransform function above consumes transform-origin
    // and accounts for it in the initialTransform. So we zero-out the
    // actual transform-origin and all is well.
    this.newElement.css('transform-origin', '0 0');
    return animate(this.newElement, motion, opts);
  } else {
    let initialTransform = currentTransform(this.oldElement);
    let motion = {
      translateX: [relativeTranslateX + initialTransform.tx, initialTransform.tx],
      translateY: [relativeTranslateY + initialTransform.ty, initialTransform.ty],
      scaleX: [ initialTransform.a * relativeScaleX, initialTransform.a ],
      scaleY: [ initialTransform.d * relativeScaleY, initialTransform.d ]
    };
    this.newElement.css({ visibility: 'hidden' });
    this.oldElement.css('transform-origin', '0 0');
    return animate(this.oldElement, motion, opts).then(() => {
      this.newElement.css({ visibility: ''});
    });
  }
}
