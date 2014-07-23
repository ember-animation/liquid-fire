export default function(){

  // BEGIN-SNIPPET transition-demo
  this.transition(
    this.fromRoute('helpers.liquid-outlet.index'),
    this.toRoute('helpers.liquid-outlet.other'),
    this.use('toLeft')
  );
  // END-SNIPPET

  this.transition(
    this.fromRoute('helpers.liquid-outlet.other'),
    this.toRoute('helpers.liquid-outlet.index'),
    this.use('toRight')
  );

  // BEGIN-SNIPPET with-demo
  this.transition(
    this.withinRoute('helpers.liquid-with.page'),
    this.use('rotateBelow')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET bind-demo-transition
  this.transition(
    this.between({childOf: '#liquid-bind-demo > div'}),
    this.use('toUp')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET liquid-if-demo-transition
  this.transition(
    this.withinRoute('helpers.liquid-if'),
    this.use('crossFade')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET liquid-box-demo-transition
  this.transition(
    // TODO: this case needs a friendlier API shortcut.
    //
    //If we just said between({class: 'vehicles'}) we'd get an
    // unintended animation at the first render.
    this.fromContext(function(change){
      return typeof(change.leaving.context) !== "undefined";
    }),
    this.toContext({'class': 'vehicles'}),
    this.use('crossFade')
  );
  // END-SNIPPET


}
