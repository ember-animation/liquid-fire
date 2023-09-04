import { animate, Promise } from '../index';

export default function flyTo(opts = {}) {
  if (!this.newElement) {
    return Promise.resolve();
  } else if (!this.oldElement) {
    this.newElement.style.visibility = '';
    return Promise.resolve();
  }

  const oldOffset = getOffset(this.oldElement);
  const newOffset = getOffset(this.newElement);

  if (opts.movingSide === 'new') {
    const motion = {
      translateX: [0, oldOffset.left - newOffset.left],
      translateY: [0, oldOffset.top - newOffset.top],
      outerWidth: [this.newElement.offsetWidth, this.oldElement.offsetWidth],
      outerHeight: [this.newElement.offsetHeight, this.oldElement.offsetHeight],
    };
    this.oldElement.style.visibility = 'hidden';
    return animate(this.newElement, motion, opts);
  } else {
    const motion = {
      translateX: newOffset.left - oldOffset.left,
      translateY: newOffset.top - oldOffset.top,
      outerWidth: this.newElement.offsetWidth,
      outerHeight: this.newElement.offsetHeight,
    };
    this.newElement.style.visibility = 'hidden';
    return animate(this.oldElement, motion, opts).then(() => {
      this.newElement.style.visibility = '';
    });
  }
}

function getOffset(ele) {
  const rect = ele?.getBoundingClientRect() ?? { top: 0, left: 0 };
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}
