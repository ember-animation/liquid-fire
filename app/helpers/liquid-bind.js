export default {
  isHTMLBars: true,
  helperFunction: function liquidBindHelper(params, hash, options, env) {
    var view = env.data.view;

    var componentLookup = view.container.lookup('component-lookup:main');
    var cls = componentLookup.lookupFactory('liquid-bind-c');
    hash.value = params[0];
    if (hash['class']) {
      hash.innerClass = hash['class'];
      delete hash['class'];
    }
    env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
  }
};
