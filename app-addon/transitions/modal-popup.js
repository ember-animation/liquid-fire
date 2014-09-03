/* global $ */

import { Promise } from "vendor/liquid-fire";

function hideModal(oldView) {
  var box, obscure;
  if (!oldView ||
      !(box = oldView.$('.lm-container > div')[0]) ||
      !(obscure = oldView.$('.lf-overlay')[0])) {
    return Promise.cast();
  }

  return Promise.all([
    $.Velocity.animate(obscure, {opacity: [0, 0.5]}, {duration: 200}),
    $.Velocity.animate(box, {scale: [0, 1]}, {duration: 200})
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
    // liquid-fire always starts newView at "display: none", the
    // animate function normally handles clearing it for us.
    newView.$().css('display', 'block');
    return Promise.all([
      $.Velocity.animate(obscure, {opacity: [0.5, 0]}, {duration: 200}),
      $.Velocity.animate(box, {scale: [1, 0]}, {duration: 200})
    ]);
  });
}

export default function modalPopup(oldView, insertNewView) {
  return hideModal(oldView).then(function() {
    return revealModal(insertNewView);
  });
}
