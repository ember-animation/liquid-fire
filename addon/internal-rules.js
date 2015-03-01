export default function() {
  this.setDefault({duration: 250});

  this.transition(
    this.inHelper('liquid-modal'),
    this.use('modal-popup')
  );

}
