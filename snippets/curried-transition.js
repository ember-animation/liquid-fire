this.define('blueAnimation', 'myAnimation', 'blue', { duration: 300 });

this.transition(
  this.withinRoute('home'),
  this.use('blueAnimation')
);
