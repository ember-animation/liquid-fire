import Ember from "ember";
import getOwner from 'ember-getowner-polyfill';
import { getComponentFactory } from 'liquid-fire/ember-internals';
import layout from 'liquid-fire/templates/components/liquid-modal';

export default Ember.Component.extend({
  layout,
  classNames: ['liquid-modal'],
  currentContext: Ember.computed('owner.modalContexts.lastObject', function(){
    var context = this.get('owner.modalContexts.lastObject');
    if (context) {
      context.view = this.innerView(context);
    }
    return context;
  }),

  owner: Ember.inject.service('liquid-fire-modals'),

  innerView: function(current) {
    var self = this,
        name = current.get('name'),
        component = getComponentFactory(getOwner(this), name);
    Ember.assert("Tried to render a modal using component '" + name + "', but couldn't find it.", !!component);

    var args = Ember.copy(current.get('params'));

    args.registerMyself = Ember.on('init', function() {
      self.set('innerViewInstance', this);
    });

    // set source so we can bind other params to it
    args._source = Ember.computed(function() {
      return current.get("source");
    });

    var otherParams = current.get("options.otherParams");
    var from, to;
    for (from in otherParams) {
      to = otherParams[from];
      args[to] = Ember.computed.alias("_source."+from);
    }

    var actions = current.get("options.actions") || {};

    // Override sendAction in the modal component so we can intercept and
    // dynamically dispatch to the controller as expected
    args.sendAction = function(name) {
      var actionName = actions[name];
      if (!actionName) {
        this._super.apply(this, Array.prototype.slice.call(arguments));
        return;
      }

      var controller = current.get("source");
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift(actionName);
      controller.send.apply(controller, args);
    };

    return component.extend(args);
  },

  actions: {
    outsideClick: function() {
      if (this.get('currentContext.options.dismissWithOutsideClick')) {
        this.send('dismiss');
      } else {
        proxyToInnerInstance(this, 'outsideClick');
      }
    },
    escape: function() {
      if (this.get('currentContext.options.dismissWithEscape')) {
        this.send('dismiss');
      } else {
        proxyToInnerInstance(this, 'escape');
      }
    },
    dismiss: function() {
      Ember.$('body').addClass('lf-modal-closing');
      var source = this.get('currentContext.source'),
          proto = source.constructor.proto(),
          params = this.get('currentContext.options.withParams'),
          clearThem = {};

      for (var key in params) {
        if (proto[key] instanceof Ember.ComputedProperty) {
          clearThem[key] = undefined;
        } else {
          clearThem[key] = proto[key];
        }
      }
      source.setProperties(clearThem);
    }
  }
});

function proxyToInnerInstance(self, message) {
  var vi = self.get('innerViewInstance');
  if (vi) {
    vi.send(message);
  }
}
