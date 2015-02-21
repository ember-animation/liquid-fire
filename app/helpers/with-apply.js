import Ember from "ember";

// This helper is internal to liquid-with.

export default {
  isHTMLBars: true,
  helperFunction: function withApplyHelperFunc(params, hash, options, env) {
    var parent = this.get('liquidWithParent');
    var withArgs = parent.get('originalArgs').slice();
    withArgs[0] = 'lwith-view.boundContext';
    options = Ember.copy(options);
    if (!this._keywords) {
      this._keywords = {};
    }
    this._keywords['lwith-view'] = this;
    options.template = parent.get('innerTemplate');
    hash = parent.get('originalHash');
    options.hashTypes = parent.get('originalHashTypes');
    env.helpers.with.helperFunction.call(this, [this.getStream(withArgs[0])], hash, options, env);
  }
};
