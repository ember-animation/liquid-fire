import { animate, stop } from "liquid-fire";

export default function (oldView, insertNewView) {
  
  // Example:
  // First we stop any animation on the oldView. We then call Animate on the oldView, 
  // which returns us a promise. Once the first step resolves we insertNewView and then 
  // animate the new view.

  // stop(oldView);
  // var firstStep = animate(oldView, {opacity: 0}, {duration: '10'}, 'fade-out');

  // return firstStep.then(insertNewView).then(function(newView){
  //   return animate(newView, {left: ['0px', '100px'], opacity: [1, 0]}, {easing: 'easeOutQuart'}, 'slide-in');
  // });
}
