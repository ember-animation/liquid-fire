import Ember from "ember";

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
    this.between({childOf: '#liquid-with-demo'}),
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
    this.between({childOf: '#liquid-if-demo > div'}),
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

  this.transition(
    this.fromRoute('test-outlet.index'),
    this.toRoute('test-outlet.second'),
    this.toRoute('test-outlet.third'),
    this.use('toLeft')
  );

  this.transition(
    this.fromRoute('test-outlet.second'),
    this.fromRoute('test-outlet.third'),
    this.toRoute('test-outlet.index'),
    this.use('toRight')
  );

  function person(){
    return this && Ember.get(this, 'isPerson');
  }

  function higherPerson(change){
    return person.apply(this) &&
      change.leaving.context.get('id') < change.entering.context.get('id');
  }

  function lowerPerson(change){
    return person.apply(this) &&
      change.leaving.context.get('id') > change.entering.context.get('id');
  }



  this.transition(
    this.fromContext(person),
    this.toContext(higherPerson),
    this.use('toDown')
  );

  this.transition(
    this.fromContext(person),
    this.toContext(lowerPerson),
    this.use('toUp')
  );

  this.transition(
    this.fromContext(null),
    this.toContext(person),
    this.use('crossFade')
  );

  this.transition(
    this.between({childOf: '#bind-test-container'}),
    this.use('toLeft')
  );

  this.transition(
    this.between({class: 'demo-if'}),
    this.use('crossFade')
  );

}
