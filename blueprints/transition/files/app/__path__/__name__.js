import { animate, stop } from "liquid-fire";

export default function (oldView, insertNewView) {
  
  // Stop any currently running animation on oldView
  stop(oldView);

  // Fade out the old view
  return animate(oldView, { opacity: 0 })
  // Render the new view
    .then(insertNewView)
  // And fade it in, from opacity 0 to 1
    .then(function(newView){
      return animate(newView, { opacity: [1, 0]});
    });
}
