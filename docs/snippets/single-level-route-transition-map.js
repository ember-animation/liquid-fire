export default function () {
  this.transition(
    this.fromRoute('index'),
    this.toRoute('posts'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
