import Ember from "ember";
import { Promise } from "liquid-fire";
var Velocity = Ember.$.Velocity;

function hideModal(oldElement) {
  var box, obscure;
  if (!oldElement ||
      !(box = oldElement.find('.lm-container > div')) ||
      !(box = box[0]) ||
      !(obscure = oldElement.find('.lf-overlay')) ||
      !(obscure = obscure[0])) {
    return Promise.resolve();
  }

  return Promise.all([
    Velocity.animate(obscure, {opacity: [0, 0.5]}, {duration: 250}),
    Velocity.animate(box, {scale: [0, 1]}, {duration: 250})
  ]);
}

function revealModal(newElement) {
  var box, obscure;
  if (!newElement ||
      !(box = newElement.find('.lm-container > div')[0]) ||
      !(obscure = newElement.find('.lf-overlay')[0])) {
    return Promise.resolve();
  }

  // we're not going to animate the whole view, rather we're going
  // to animate two pieces of it separately. So we move the view
  // properties down onto the individual elements, so that the
  // animate function can reveal them at precisely the right time.
  Ember.$(box).css({
    display: 'none'
  });

  Ember.$(obscure).css({
    display: 'none'
  });
  newElement.css({
    visibility: ''
  });

  return Promise.all([
    Velocity.animate(obscure, {opacity: [0.5, 0]}, {duration: 250, display: ''}),
    Velocity.animate(box, {scale: [1, 0]}, {duration: 250, display: ''})
  ]);
}

export default function modalPopup() {
  return hideModal(this.oldElement).then(() => {
    return revealModal(this.newElement);
  });
}
