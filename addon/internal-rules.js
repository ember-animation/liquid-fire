export default function() {
  this.setDefault({duration: 250});

  this.transition(
    this.hasClass('lm-with'),
    this.use('modal-popup')
  );
}
