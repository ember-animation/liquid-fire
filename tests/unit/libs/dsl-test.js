import { Transitions } from "liquid-fire/libs/liquid-fire";
import Ember from "ember";

var t, oldView, newContent;
function dummyAction() {}

function lookupTransition() {
  return t.transitionFor(oldView, newContent).animation;
}

module("Transitions DSL", {
  setup: function(){
    t = new Transitions();
    oldView = Ember.View.create();
    newContent = Ember.View.create();
  }
});

test("it exists", function(){
  t.map(function(){
    this.transition(
      this.fromRoute('one'),
      this.toRoute('two'),
      this.use(dummyAction)
    );
  });

  oldView.set('currentView', Ember.View.create({renderedName: 'one'}));
  newContent.set('renderedName', 'two');
  equal(lookupTransition(), dummyAction);
  
});
