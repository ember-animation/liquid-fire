import Ember from "ember";

export default Ember.Mixin.create({
  initializeModalContext: Ember.on('init', function() {
    this.set('modalContexts', Ember.A());
    Ember.run.scheduleOnce('afterRender', this, 'appendModalContainer');
  }),

  appendModalContainer: function() {
    var container = this.get('container');
    var Component = container.lookup('component-lookup:main').lookupFactory('liquid-modal');
    this._modalContainer = Component.create({owner: this});
    this._modalContainer.appendTo('body');
  },

  updateModalContext: Ember.observer('testModal', function() {
    var ctxts = this.get('modalContexts');

    var m = this.get('testModal');
    var haveM = ctxts.find(function(c) { return c.name === 'test-popup'; });

    if (m && !haveM) {
      ctxts.pushObject({
        name: 'test-popup',
        model: Ember.Object.create({id: m, isOrder: true})
      });
    } else if (!m && haveM) {
      ctxts.removeObject(haveM);
    }
  }),

});
