export default function() {
  this.transition(
    this.childOf('.liquid-modal'),
    this.use('modal-popup')
  );
}
