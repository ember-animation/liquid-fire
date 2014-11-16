import { animate, stop } from "liquid-fire";

export default function fade(oldView, insertNewView) {
  stop(oldView);
  return animate(oldView, {opacity: 0})
    .then(insertNewView)
    .then(function(newView){
      return animate(newView, {opacity: [1, 0]});
    });
}
