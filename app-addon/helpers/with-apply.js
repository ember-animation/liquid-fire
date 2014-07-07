import Ember from "ember";

// This helper is internal to liquid-with.
export default function withApplyHelper(options){
  var view = options.data.view,
      withArgs = view.get('originalArgs').slice();

  withArgs[0] = 'lwith-view.boundContext';
  options = Ember.copy(options);
  options.data.keywords['lwith-view'] = view;
  options.fn = view.get('innerTemplate');
  withArgs.push(options);
  return Ember.Handlebars.helpers.with.apply(this, withArgs);
}
