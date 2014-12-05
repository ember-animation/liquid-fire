import Ember from "ember";

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
    this.childOf('#liquid-bind-demo'),
    this.use('toUp')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET liquid-box-demo-transition
  this.transition(
    this.hasClass('vehicles'),

    // this makes our rule apply when the liquid-if transitions to the
    // true state.
    this.toModel(true),
    this.use('crossFade', {duration: 1000}),

    // which means we can also apply a reverse rule for transitions to
    // the false state.
    this.reverse('toLeft', {duration: 1000})
  );
  // END-SNIPPET

  this.transition(
    this.childOf("#interrupted-fade-demo"),
    this.use('fade', { duration: Ember.testing ? 100 : 1500 })
  );

  this.transition(
    this.childOf("#inline-serial-scenario"),
    this.use('fade', {duration: 1000})
  );

  this.transition(
    this.childOf("#inline-scenario"),
    this.toModel(true),
    this.use('toLeft', {duration: 1000}),
    this.reverse('toRight', {duration: 1000})
  );

  this.transition(
    this.fromRoute('scenarios.nested-outlets.middle'),
    this.toRoute('scenarios.nested-outlets.middle2'),
    this.use('fade', {duration: Ember.testing ? 100 : 1000}),
    this.reverse('fade', {duration: 1000})
  );

  this.transition(
    this.fromRoute('scenarios.nested-outlets.middle.index'),
    this.toRoute('scenarios.nested-outlets.middle.inner'),
    this.use('fade', {duration: 1000}),
    this.reverse('fade', {duration: 1000})
  );
}
