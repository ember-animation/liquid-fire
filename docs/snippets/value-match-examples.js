/* global Person */
// Matches any change that ends up with a value that's a Person.
this.transition(
  this.toValue(function (value) {
    value instanceof Person;
  }),
  this.use('toLeft')
);

// You can constrain the from-value too.
this.transition(this.fromValue('foo'), this.toValue('bar'), this.use('toLeft'));

// When you want to constrain both the same, you can use shorthand:
this.transition(
  this.betweenValues(function (value) {
    return value > 10;
  }),
  this.use('toLeft')
);

// `null` matches an undefined value.
this.transition(this.fromValue(null), this.use('fade'));

// `true` is essentially shorthand for function(value){ return value; }. And
// `false` works too. These are useful when you're writing a rule that
// targets a liquid-if and you want to animate differently for the two
// different logical transitions.
this.transition(
  this.hasClass('fancy-choice'),
  this.toValue(true),
  this.use('toUp'),
  this.reverse('toDown')
);

// Your test functions also receive an additional argument containing
// the "other" value, so you can do direct comparisons between them:
this.transition(
  // compare them by id and only run this animation if we're moving to
  // a value with a higher id.
  this.toValue(function (toValue, fromValue) {
    return toValue && fromValue && toValue.get('id') > fromValue.get('id');
  }),

  this.use('toLeft')
);
