// The simplest 'use' just calls a named transition.
this.transition(
  this.withinRoute('foo'),
  this.use('fade')
);

// Named transitions may take arguments. For example, the predefined
// 'fade' transition accepts an `opts` hash that's passed through to
// Velocity, so you can say:
this.transition(
  this.withinRoute('foo'),
  this.use('fade', { duration: 3000 })
);

// You can also provide an implementation directly instead of a
// name. This takes the same kind of function as `define`, which we
// talk about more in the next section.
import { animate, stop } from "vendor/liquid-fire";
this.transition(
  this.withinRoute('foo'),
  this.use(function(oldView, insertNewView, opts) {
    stop(oldView);
    return animate(oldView, {opacity: 0}, opts)
      .then(insertNewView)
      .then(function(newView){
        return animate(newView, {opacity: [1, 0]}, opts);
      });
  })
);
