import { stop, animate, Promise, isAnimating, finish } from "liquid-fire";

export default function moveOver(dimension, direction, opts) {
  var oldParams = {},
      newParams = {},
      firstStep,
      property,
      measure;

  if (dimension.toLowerCase() === 'x') {
    property = 'translateX';
    measure = 'width';
  } else {
    property = 'translateY';
    measure = 'height';
  }

  if (isAnimating(this.oldElement, 'moving-in')) {
    firstStep = finish(this.oldElement, 'moving-in');
  } else {
    stop(this.oldElement);
    firstStep = Promise.resolve();
  }

  return firstStep.then(() => {
    if (this.newElement && this.oldElement) {
      var sizes = [parseInt(this.newElement.css(measure), 10),
                   parseInt(this.oldElement.css(measure), 10)];
      var bigger = Math.max.apply(null, sizes);
      oldParams[property] = (bigger * direction) + 'px';
      newParams[property] = ["0px", (-1 * bigger * direction) + 'px'];
    } else {
      oldParams[property] = (100 * direction) + '%';
      newParams[property] = ["0%", (-100 * direction) + '%'];
    }

    return Promise.all([
      animate(this.oldElement, oldParams, opts),
      animate(this.newElement, newParams, opts, 'moving-in')
    ]);
  });
}
