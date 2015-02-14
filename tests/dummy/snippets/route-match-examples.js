// Matches any transition that ends up in the route named 'foo', no
// matter where it came from.
this.transition(
  this.toRoute('foo'),
  this.use('toLeft')
);

// This is equivalent to the previous example, but showing a more
// generic form that lets you provide an arbitrary test.
this.transition(
  this.toRoute(function(routeName){ return routeName === 'foo'; }),
  this.use('toLeft')
);

// You can list multiple routes, and the constraint will be satisfied
// by any of them. This wil match any transition that ends up in 'foo'
// or 'bar'.
this.transition(
  this.toRoute('foo', 'bar'),
  this.use('toLeft')
);

// You can mix and match strings and functions. This is equivalent to
// the previous example.
this.transition(
  this.toRoute('foo', function(routeName){ return routeName === 'bar'; }),
  this.use('toLeft')
);

// All of these examples apply to fromRoute too. This will match any
// transition from 'foo' to 'bar', or from 'foo' to any route name
// starting with 'q'.
this.transition(
  this.fromRoute('foo'),
  this.toRoute('bar', function(routeName){ return /^q/.test(routeName); }),
  this.use('toLeft')
);

// withinRoute is just a shorthand. Instead of saying this:
this.transition(
  this.fromRoute('foo'),
  this.toRoute('foo'),
  this.use('toLeft')
);
// you can say this:
this.transition(
  this.withinRoute('foo'),
  this.use('toLeft')
);

// All of the route constraints also accept null to match the empty
// route. The empty route is the initial route the very first time an
// outlet is rendered.  So this example causes the 'foo' route to fade
// in during the initial render:
this.transition(
  this.fromRoute(null),
  this.toRoute('foo'),
  this.use('fade')
);
