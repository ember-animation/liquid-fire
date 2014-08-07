/* app/transitions/blue-animation.js */
import { curryTransition } from "vendor/liquid-fire";
export default curryTransition('myAnimation', 'blue', { duration: 300 });

/* within app/transitions.js */
this.transition(
  this.withinRoute('home'),
  this.use('blueAnimation')
);
