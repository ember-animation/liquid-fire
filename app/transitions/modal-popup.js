import Ember from "ember";
import { animate, explode, Promise } from "liquid-fire";

// The default transition for animating the background overlay element
// in and out.
function animateOverlay() {
  return Promise.all([
    animate(this.oldElement, {opacity: [0, 0.5]}, {duration: 250}),
    animate(this.newElement, {opacity: [0.5, 0]}, {duration: 250, display: ''})
  ]);
}

// The default transition for animating the dialog box in and out.
function animateDialog() {
  return Promise.all([
    animate(this.oldElement, {scale: [0, 1]}, {duration: 250}),
    animate(this.newElement, {scale: [1, 0]}, {duration: 250, display: ''})
  ]);
}

export default function modalPopup(opts={}) {
  var [overlay, box] = explode(this, [
    '.lf-overlay',
    '.lm-container > div'
  ]);

  var overlayAnimation = animateOverlay;
  var overlayAnimationArgs = [];
  if (opts.overlay) {
    if (Ember.isArray(opts.overlay)) {
      overlayAnimation = this.lookup(opts.overlay[0]);
      overlayAnimationArgs = opts.overlay.slice(1);
    } else {
      overlayAnimation = this.lookup(opts.overlay);
    }
  }

  var boxAnimation = animateDialog;
  var boxAnimationArgs = [];
  if (opts.box) {
    if (Ember.isArray(opts.box)) {
      boxAnimation = this.lookup(opts.box[0]);
      boxAnimationArgs = opts.box.slice(1);
    } else {
      boxAnimation = this.lookup(opts.box);
    }
  }

  return Promise.all([
    overlayAnimation.apply(overlay, overlayAnimationArgs),
    boxAnimation.apply(box, boxAnimationArgs)
  ]);

}
