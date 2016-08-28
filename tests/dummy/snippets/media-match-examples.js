// Matches small screens with a width below 321px. Usually small mobile devices.
this.transition(
  this.toRoute('foo'),
  this.media('(max-width: 320px)'),
  this.use('toLeft')
);

// Matches screens between 321px and 768px. Like large phones and tablets.
this.transition(
  this.toRoute('foo'),
  this.media('(min-width: 321px) and (max-width: 768px)'),
  this.use('fade')
);

// Matches screens with a width larger than the height
this.transition(
  this.toRoute('foo'),
  this.media('(orientation:landscape)'),
  this.use('toBottom')
);
