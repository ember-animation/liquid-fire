export default function() {
  this.setDefault({duration: 250});

  this.transition(
    this.inHelper('liquid-modal'),
    this.use('explode', {
      pick: '.lf-overlay',
      use: ['fade', { maxOpacity: 0.5 }]
    }, {
      pick: '.lf-dialog',
      use: 'scale'
    })
  );

}
