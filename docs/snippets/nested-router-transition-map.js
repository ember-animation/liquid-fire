export default function () {
  this.transition(
    this.fromRoute('index'),
    this.toRoute('posts'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
  this.transition(
    this.fromRoute('posts.index'),
    this.toRoute('posts.new'),
    this.use('crossFade'),
    this.reverse('crossFade')
  );
}
