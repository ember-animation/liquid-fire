export default function(){

  // BEGIN-SNIPPET transition-demo
  this.transition(
    this.fromRoute('helpers-documentation.liquid-outlet.index'),
    this.toRoute('helpers-documentation.liquid-outlet.other'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET bind-demo-transition
  this.transition(
    this.childOf('#liquid-bind-demo > div'),
    this.use('toUp')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET liquid-if-demo-transition
  this.transition(
    this.withinRoute('helpers-documentation.liquid-if'),
    this.use('crossFade')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET liquid-box-demo-transition
  this.transition(
    // hasClass('vehicles') is true even during the first render, so
    // we also require fromNonEmptyModel to prevent an animation when
    // the page first loads.
    this.fromNonEmptyModel(),
    this.hasClass('vehicles'),
    this.use('crossFade')
  );
  // END-SNIPPET

  this.transition(
    this.childOf("#interrupted-fade-demo > div"),
    this.use('fade', { duration: 1500 })
  );
}
