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
  
  this.transition(
    this.fromContext(person),
    this.toContext(person),
    this.use('toDown')
  );

  this.transition(
    this.fromContext('empty'),
    this.toContext(person),
    this.use('crossFade')
  );

}
