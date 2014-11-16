import Ember from "ember";
export default Ember.Controller.extend({
  otherState: false,

  myThing: Ember.computed('otherState', function() {
    if (this.get('otherState')) {
      return Ember.Object.create({description: 'Foo'});
    } else {
      return Ember.Object.create({description: 'Bar baz qux'});
    }
  })

});
