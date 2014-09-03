import Ember from "ember";

export default Ember.Handlebars.EachView.extend({
  // Deliberately neutering the original behavior so that outgoing
  // views are not yet destroyed.
  arrayWillChange: Ember.K,




});
