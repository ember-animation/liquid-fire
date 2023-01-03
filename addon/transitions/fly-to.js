import { animate, Promise } from 'liquid-fire';

export default function flyTo(opts = {}) {
  if (!this.newElement) {
    return Promise.resolve();
  } else if (!this.oldElement) {
    this.newElement.style.visibility = '';
    return Promise.resolve();
  }

  let oldOffset = getOffset(this.oldElement);
  let newOffset = getOffset(this.newElement);

  if (opts.movingSide === 'new') {
    let motion = {
      translateX: [0, oldOffset.left - newOffset.left],
      translateY: [0, oldOffset.top - newOffset.top],
      outerWidth: [this.newElement.offsetWidth, this.oldElement.offsetWidth],
      outerHeight: [this.newElement.offsetHeight, this.oldElement.offsetHeight],
    };
    this.oldElement.style.visibility = 'hidden';
    return animate(this.newElement, motion, opts);
  } else {
    let motion = {
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
  const rect = ele.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}
