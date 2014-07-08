import Ember from "ember";

export default function(){
  //  this.setDefault({duration: 3000});

  this.transition(
    this.fromRoute('test-outlet.index'),
    this.toRoute('test-outlet.second'),
    this.toRoute('test-outlet.third'),    
    this.use('toRight')
  );

  this.transition(
    this.fromRoute('test-outlet.second'),
    this.fromRoute('test-outlet.third'),    
    this.toRoute('test-outlet.index'),
    this.use('toLeft')
  );

  function person(){
    return Ember.get(this, 'isPerson');
  }

  function higherPerson(change){
    if (!Ember.get(this, 'isPerson')) {
      return false;
    }
    return change.leaving.context.get('id') < change.entering.context.get('id');
  }

  function lowerPerson(change){
    if (!Ember.get(this, 'isPerson')) {
      return false;
    }
    return change.leaving.context.get('id') > change.entering.context.get('id');
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

}
