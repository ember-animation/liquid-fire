import Ember from "ember";

var isHTMLBars = !!Ember.HTMLBars;

// This helper is internal to liquid-with.
function withApplyHelperFunc() {
  var hash, options, env, view;

  if (isHTMLBars) {
    hash = arguments[1];
    options = arguments[2];
    env = arguments[3];
    view = this;
  } else {
    options = arguments[0];
    hash = options.hash;
    view = options.data.view;
  }

  var parent = view.get('liquidWithParent');
  var withArgs = parent.get('originalArgs').slice();

  withArgs[0] = 'lwith-view.boundContext';
  options = Ember.copy(options);

  // This works to inject our keyword in Ember >= 1.9
  if (!view._keywords) {
    view._keywords = {};
  }
  view._keywords['lwith-view'] = view;

  // This works to inject our keyword in Ember < 1.9
  if (!isHTMLBars) {
    if (!options.data.keywords) {
      options.data.keywords = {};
    }
    options.data.keywords['lwith-view'] = view;
  }

  if (isHTMLBars) {
    options.template = parent.get('innerTemplate');
  } else {
    options.fn = parent.get('innerTemplate');
  }

  hash = parent.get('originalHash');
  options.hashTypes = parent.get('originalHashTypes');

  if (isHTMLBars) {
    env.helpers.with.helperFunction.call(this, [view.getStream(withArgs[0])], hash, options, env);
  } else {
    options.hash = hash;
    withArgs.push(options);
    return Ember.Handlebars.helpers.with.apply(this, withArgs);
  }
}

var withApplyHelper = withApplyHelperFunc;
if (Ember.HTMLBars) {
  withApplyHelper = {
    isHTMLBars: true,
    helperFunction: withApplyHelperFunc,
    preprocessArguments: function() { }
  };
}

export default withApplyHelper;
