// Matches any transition that ends up in the outlet named 'panel', no
// matter where it came from.
// {{liquid-outlet 'panel'}}
this.transition(this.outletName('panel'), this.use('toLeft'));

// Matches nothing to something in the 'panel' outlet
this.transition(
  this.outletName('panel'),
  this.fromRoute(null),
  this.use('toLeft', { duration: 100, easing: 'easeInOut' }),
  this.reverse('toRight', { duration: 500, easing: 'easeInOut' })
);

// Matches the default outlet only
this.transition(this.outletName('main'), this.use('crossFade'));
