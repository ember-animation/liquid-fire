// The inclusion of `this.debug()` below causes the match results to be
// logged to the console, so you can see if this transition is not
// animating because the fromRoute is not 'foo', or because the toRoute
// is not 'bar'.
this.transition(
  this.fromRoute('foo'),
  this.toRoute('bar'),
  this.use('crossFade'),
  this.debug()
);
