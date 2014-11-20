import Ember from "ember";

// This helper is internal to liquid-with.
export default function withApplyHelper(options){
  var view = options.data.view,
      parent = view.get('liquidWithParent'),
      withArgs = parent.get('originalArgs').slice();

  withArgs[0] = 'lwith-view.boundContext';
  options = Ember.copy(options);

  // This works to inject our keyword in Ember >= 1.9
  if (!view._keywords) {
    view._keywords = {};
  }
  view._keywords['lwith-view'] = view;

  // This works to inject our keyword in Ember < 1.9
  if (!options.data.keywords) {
    options.data.keywords = {};
  }
  options.data.keywords['lwith-view'] = view;
  options.fn = parent.get('innerTemplate');
  options.hash = parent.get('originalHash');
  options.hashTypes = parent.get('originalHashTypes');
  withArgs.push(options);
  return Ember.Handlebars.helpers.with.apply(this, withArgs);
}
