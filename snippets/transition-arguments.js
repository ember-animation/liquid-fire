this.define('myAnimation', function(oldView, insertNewView, color, opts) {
  //...
});

this.transition(
  this.withinRoute('home'),
  this.use('myAnimation', 'red', { duration: 100 })
);
