Router.map(function() {
  // This defines a modal in the 'application' scope. It will observe
  // the property 'foo' on the application controller. Whenever foo
  // has a non-default value, the component 'first-modal' will render
  // in a popup.
  this.modal('first-modal', { withParams: 'foo' });

  this.resource('people', function() {
    this.route('detail');

    // This defines a modal in the 'people' scope. It will observe the
    // properties 'bar' and 'baz' on the people controller. Whenever
    // the people route is active and bar or baz have non-default
    // values, the component 'second-modal' will render in a popup.
    this.modal('second-modal', { withParams: ['bar', 'baz'] });

  });
});
