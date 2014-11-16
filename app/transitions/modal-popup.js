import Ember from "ember";
import { Promise } from "liquid-fire";
var Velocity = Ember.$.Velocity;

function hideModal(oldView) {
  var box, obscure;
  if (!oldView ||
      !(box = oldView.$('.lm-container > div')) ||
      !(box = box[0]) ||
      !(obscure = oldView.$('.lf-overlay')) ||
      !(obscure = obscure[0])) {
    return Promise.resolve();
  }

  return Promise.all([
    Velocity.animate(obscure, {opacity: [0, 0.5]}, {duration: 250}),
    Velocity.animate(box, {scale: [0, 1]}, {duration: 250})
  ]);
}

function revealModal(insertNewView) {
  return insertNewView().then(function(newView){
    var box, obscure;
    if (!newView ||
        !(box = newView.$('.lm-container > div')[0]) ||
        !(obscure = newView.$('.lf-overlay')[0])) {
      return;
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
    newView.$().css({
      display: '',
      visibility: ''
    });

    return Promise.all([
      Velocity.animate(obscure, {opacity: [0.5, 0]}, {duration: 250, display: ''}),
      Velocity.animate(box, {scale: [1, 0]}, {duration: 250, display: ''})
    ]);
  });
}

export default function modalPopup(oldView, insertNewView) {
  return hideModal(oldView).then(function() {
    return revealModal(insertNewView);
  });
}
