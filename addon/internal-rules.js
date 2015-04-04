export default function() {
  this.setDefault({duration: 250});
  // BEGIN-SNIPPET default-modal-rule
  this.transition(
    this.inHelper('liquid-modal'),
    this.use('explode', {
      pick: '.lf-overlay',
      use: ['cross-fade', { maxOpacity: 0.5 }]
    }, {
      pick: '.lm-container',
      use: 'scale'
    })
  );
  // END-SNIPPET

}
