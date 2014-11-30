import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['liquid-modal'],
  currentContext: Ember.computed.oneWay('owner.modalContexts.lastObject'),

  owner: null, // set by injection

  innerView: Ember.computed('currentContext', function() {
    var self = this,
        current = this.get('currentContext'),
        name = current.get('name'),
        container = this.get('container'),
        component = container.lookup('component-lookup:main').lookupFactory(name);
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
  }),

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
      var source = this.get('currentContext.source'),
          proto = source.constructor.proto(),
          params = this.get('currentContext.options.withParams'),
          clearThem = {};

      for (var key in params) {
        clearThem[key] = proto[key];
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
