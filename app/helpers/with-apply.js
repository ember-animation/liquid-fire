import Ember from "ember";

// This helper is internal to liquid-with.

export default {
  isHTMLBars: true,
  helperFunction: function withApplyHelperFunc(params, hash, options, env) {
    var view = env.data.view;
    var parent = view.get('liquidWithParent');
    var withArgs = parent.get('originalArgs').slice();
    withArgs[0] = 'lwith-view.boundContext';
    options = Ember.copy(options);
    if (!view._keywords) {
      view._keywords = {};
    }
    view._keywords['lwith-view'] = view;
    options.template = parent.get('innerTemplate');
    hash = parent.get('originalHash');
    options.hashTypes = parent.get('originalHashTypes');
    env.helpers.with.helperFunction.call(this, [view.getStream(withArgs[0])], hash, options, env);
  }
};
