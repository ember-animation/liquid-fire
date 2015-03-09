import Ember from "ember";

export function setOutletState(state) {
  Ember.run(() => {
    outlet().setOutletState(state);
  });
}

export function outlet() {
  return Ember.View.views[Ember.$('#ember-testing > .ember-view').attr('id')].get('_childViews').find((child) => child._isOutlet);
}

export function withTemplate(string) {
  return {
    render: {
      template: Ember.Handlebars.compile(string)
    },
    outlets: {}
  };
}
