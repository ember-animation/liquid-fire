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

// This declares two symmetric rules: "from foo to bar use toLeft" and
// "from bar to foo use toRight".
this.transition(
  this.fromRoute('foo'),
  this.toRoute('bar'),
  this.use('toLeft'),
  this.reverse('toRight')
);

// You can also provide an implementation instead of a name, though
// it's probably better to keep implementations in separate files. We
// talk more about transition implementations in the next section.
import { animate, stop } from "liquid-fire";
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
