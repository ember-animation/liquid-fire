this.transition(
  // TODO: this case needs a friendlier API shortcut.
  //
  //If we just said between({class: 'vehicles'}) we'd get an
  // unintended animation at the first render.
  this.fromContext(function(change){
    return typeof(change.leaving.context) !== "undefined";
  }),
  this.toContext({'class': 'vehicles'}),
  this.use('crossFade')
);
