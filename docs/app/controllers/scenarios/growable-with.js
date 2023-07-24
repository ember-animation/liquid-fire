import EmberObject, { computed } from '@ember/object';
import Controller from '@ember/controller';
export default Controller.extend({
  otherState: false,

  myThing: computed('otherState', function () {
    if (this.otherState) {
      return EmberObject.create({ description: 'Foo' });
    } else {
      return EmberObject.create({ description: 'Bar baz qux' });
    }
  }),
});
