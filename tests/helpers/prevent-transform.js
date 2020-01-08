export default function preventTransform(hooks) {
  hooks.beforeEach(function() {
    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    document.querySelector('#ember-testing').style.transform = 'none';
  });

  hooks.afterEach(function() {
    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    document.querySelector('#ember-testing').style.transform = '';
  });
}
