export default function() {
  this.transition(
    this.hasClass('lm-with'),
    this.use('modal-popup')
  );
}
