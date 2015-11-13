import Ember from "ember";
import getOwner from 'ember-getowner-polyfill';
var get = Ember.get;


export default Ember.Object.extend({

  enabled: Ember.computed('modals.activeRouteNames', function() {
    return get(this, 'modals.activeRouteNames').indexOf(get(this, 'route')) >= 0;
  }),

  controller: Ember.computed('enabled', function() {
    if (!get(this, 'enabled')) { return; }
    var owner = getOwner(this);
    var name = get(this, 'options.controller') || get(this, 'route');
    return owner.lookup('controller:' + name);
  }),

  update: Ember.observer('controller', Ember.on('init', function() {
    var context = this.makeContext();
    var activeContexts = get(this, 'modals.modalContexts');
    var matchingContext = activeContexts.find((c) => get(c, 'modal') === this);

    if (context) {
      if (matchingContext) {
        activeContexts.replace(activeContexts.indexOf(matchingContext), 1, [context]);
      } else {
        activeContexts.pushObject(context);
      }
    } else {
      if (matchingContext) {
        activeContexts.removeObject(matchingContext);
      }
    }
  })),

  makeContext: function() {
    var params,
        controller = get(this, 'controller');

    if (!controller) { return; }

    params = currentParams(controller, get(this, 'options.withParams'));
    if (params) {
      return Ember.Object.create({
        modal: this,
        source: controller,
        name: get(this, 'name'),
        options: get(this, 'options'),
        params: params
      });
    }
  }

});

function currentParams(controller, paramMap) {
  var params = {};
  var proto = controller.constructor.proto();
  var foundNonDefault = false;
  var to, from, value, defaultValue;

  for (from in paramMap) {
    to = paramMap[from];
    value = controller.get(from);
    params[to] = value;
    defaultValue = proto[from];
    if (defaultValue instanceof Ember.ComputedProperty) {
      defaultValue = undefined;
    }
    if (value !== defaultValue) {
      foundNonDefault = true;
    }
  }

  if (foundNonDefault) {
    return params;
  }
}
