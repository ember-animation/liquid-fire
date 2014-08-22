export default function(){
  this.transition(
    this.fromRoute('people.index'),
    this.toRoute('people.detail'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
};
