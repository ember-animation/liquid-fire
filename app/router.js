import Ember from 'ember';

var Router = Ember.Router.extend({
  location: HtmlbarsDemoENV.locationType
});

Router.map(function() {
  this.route("second", {path: "/second/:id"});
});

export default Router;
