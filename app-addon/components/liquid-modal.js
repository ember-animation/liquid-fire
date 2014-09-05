import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['liquid-modal'],
  clickOutsideToDismiss: true,

  currentContext: Ember.computed.oneWay('owner.modalContexts.lastObject'),

  innerView: Ember.computed('currentContext', function() {
    var current = this.get('currentContext'),
        name = current.get('name'),
        container = this.get('container'),
        component = container.lookup('component-lookup:main').lookupFactory(name);
    Ember.assert("Tried to render a modal using component '" + name + "', but couldn't find it.", component);
    return component.extend(current.get('params'));
  }),

  actions: {
    clickedOutside: function() {
      if (this.get('clickOutsideToDismiss')) {
        this.sendAction('dismiss');
      }
    }
  }
});
