import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['liquid-modal'],
  clickOutsideToDismiss: true,

  innerView: Ember.computed('currentContext', function() {
    var name = this.get('currentContext.name'),
        container = this.get('container'),
        component = container.lookup('component-lookup:main').lookupFactory(name);
    Ember.assert("Tried to render a modal using component '" + name + "', but couldn't find it.", component);
    return component;
  }),

  actions: {
    clickedOutside: function() {
      if (this.get('clickOutsideToDismiss')) {
        this.sendAction('dismiss');
      }
    }
  }
});
