import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['liquid-modal'],
  currentContext: Ember.computed.oneWay('owner.modalContexts.lastObject'),

  innerView: Ember.computed('currentContext', function() {
    var self = this,
        current = this.get('currentContext'),
        name = current.get('name'),
        container = this.get('container'),
        component = container.lookup('component-lookup:main').lookupFactory(name);
    Ember.assert("Tried to render a modal using component '" + name + "', but couldn't find it.", component);

    var args = Ember.copy(current.get('params'));
    args.registerMyself = Ember.on('init', function() {
      self.set('innerViewInstance', this);
    });
    return component.extend(args);
  }),

  actions: {
    outsideClick: function() {
      if (this.get('currentContext.opts.dismissWithOutsideClick')) {
        this.send('dismiss');
      } else {
        proxyToInnerInstance(this, 'outsideClick');
      }
    },
    escape: function() {
      if (this.get('currentContext.opts.dismissWithEscape')) {
        this.send('dismiss');
      } else {
        proxyToInnerInstance(this, 'escape');
      }
    },
    dismiss: function() {
      var owner = this.get('owner'),
          proto = owner.constructor.proto(),
          params = this.get('currentContext.params'),
          clearThem = {};

      for (var key in params) {
        clearThem[key] = proto[key];
      }
      owner.setProperties(clearThem);
    }
  }
});


function proxyToInnerInstance(self, message) {
  var vi = self.get('innerViewInstance');
  if (vi) {
    vi.send(message);
  }
}
