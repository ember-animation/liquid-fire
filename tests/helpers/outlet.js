import Ember from "ember";

export function withTemplate(string) {
  return {
    render: {
      template: Ember.Handlebars.compile(string)
    },
    outlets: {}
  };
}
