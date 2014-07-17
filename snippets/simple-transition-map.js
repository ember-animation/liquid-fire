export default function(){
  this.transition(
    this.fromRoute('people.index'),
    this.toRoute('people.detail'),
    this.use('toLeft')
  );
  this.transition(
    this.fromRoute('people.detail'),
    this.toRoute('people.index'),
    this.use('toRight')
  );
};
