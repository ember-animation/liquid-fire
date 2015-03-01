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

  var overlayAnimation = opts.overlay ? this.lookup(opts.overlay) : animateOverlay;
  var boxAnimation = opts.box ? this.lookup(opts.box) : animateDialog;

  return Promise.all([
    overlayAnimation.call(overlay),
    boxAnimation.call(box)
  ]);

}
