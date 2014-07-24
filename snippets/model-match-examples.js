// Matches any transition that ends up with a model that's a Person.
this.transition(
  this.toModel(function(){ this instanceof Person }),
  this.use('toLeft')
);

// Instance checks are common so there's a shorthand. This is
// equivalent to the previous example.
this.transition(
  this.toModel({instanceOf: Person}),
  this.use('toLeft')
);

// You can list multiple constraints and they will be tested in order
// and all must pass.
this.transition(
  this.toModel({instanceOf: Person}),
  this.toModel(function(){ return this.get('age') > 21 }),
  this.use('toLeft')
);

// You can constrain the from-model too.
this.transition(
  this.fromModel({instanceOf: Person}),
  this.toModel({instanceOf: Pet}),
  this.use('toLeft')
);

// When they're both the same, you can use shorthand:
this.transition(
  this.betweenModels({instanceOf: Person}),
  this.use('toLeft')
);

// `null` matches an undefined model. The from-model will be undefined
// during the initial render.
this.transition(
  this.fromModel(null),
  this.toModel({instanceOf: Person}),
  this.use('fade')
);

// Your test functions also receive an argument containing the "other"
// model, so you can do direct comparisons between them:
this.transition(
  // First ensure that both models are defined, so that we know we can
  // safely do a comparison at all.
  this.toModel(function(){return typeof(this) !== 'undefined'; }),
  this.fromModel(function(){return typeof(this) !== 'undefined'; }),

  // Then compare them by id and only run this animation if we're
  // moving to a model with a higher id.
  this.toModel(function(fromModel) {
    return this.get('id') > fromModel.get('id');
  }),

  this.use('toLeft')
);

// The above pattern of testing for non-undefined models is common, so
// there's are shorthand methods fromNonEmptyModel, toNonEmptyModel,
// and betweenNonEmptyModels:
this.transition(
  this.betweenNonEmptyModels(),
  this.toModel(function(fromModel) {
    return this.get('id') > fromModel.get('id');
  }),
  this.use('toLeft')
);
