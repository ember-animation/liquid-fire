/* app/transitions/my-animation.js */
export default function (/* color , opts */) {
  //...
}

/* within app/transitions.js */
this.transition(
  this.toRoute('home'),
  this.use('myAnimation', 'red', { duration: 100 })
);
