import Ember from "ember";

// This helper is internal to liquid-with.
export default function withApplyHelper(options){
  debugger
  var view = options.data.keywords.view,
      withArgs = view.get('originalArgs').slice();

  withArgs[0] = 'view.context'
  options = Ember.copy(options);
  options.fn = view.get('innerTemplate');
  withArgs.push(options);
  return Ember.Handlebars.helpers.with.apply(this, withArgs);
}
