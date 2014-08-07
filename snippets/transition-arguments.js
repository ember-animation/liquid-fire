/* app/transitions/my-animation.js */
export default function(oldView, insertNewView, color, opts) {
  //...
});

/* within app/transitions.js */
this.transition(
  this.withinRoute('home'),
  this.use('myAnimation', 'red', { duration: 100 })
);
