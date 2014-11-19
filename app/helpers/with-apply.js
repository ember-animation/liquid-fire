import Ember from "ember";

// This helper is internal to liquid-with.
export default function withApplyHelper(options){
  var view = options.data.view,
      parent = view.get('liquidWithParent'),
      withArgs = parent.get('originalArgs').slice();

  withArgs[0] = 'lwith-view.boundContext';
  options = Ember.copy(options);
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
