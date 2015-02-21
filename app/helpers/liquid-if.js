import Ember from "ember";

export function factory(invert) {
  return {
    isHTMLBars: true,
    helperFunction: function liquidIfHelper(params, hash, options, env) {
      var View = this.container.lookupFactory('view:liquid-if');    
      var templates = [options.template, options.inverse];
      
      if (invert) {
        templates.reverse();
      }
      delete options.template;
      delete options.inverse;

      if (hash.containerless) {
        View = View.extend(Ember._Metamorph);
      }

      hash.templates = templates;
      hash.showFirst = params[0];
      env.helpers.view.helperFunction.call(this, [View], hash, options, env);
    }
  };
}

export default factory(false);
