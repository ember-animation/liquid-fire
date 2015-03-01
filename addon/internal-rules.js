export default function() {
  this.setDefault({duration: 250});

  this.transition(
    this.inHelper('liquid-modal'),
    this.includingInitialRender(),
    this.use('modal-popup')
  );

}
