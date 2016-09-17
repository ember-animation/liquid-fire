import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

class RouteInfo {
  constructor(builder, { template, controller, name }, outlets = {}) {
    this.builder = builder;
    this.outlets = outlets;
    this.render = {
      template,
      controller,
      name
    };
  }
  setChild(name, args) {
    return (this.outlets[name] = this.builder.makeRoute(args));
  }
  asTop() {
    return {
      outlets: {
        main: this._serialize()
      }
    };
  }
  _serialize() {
    let outlets = {};
    Object.keys(this.outlets).forEach(key => {
      outlets[key] = this.outlets[key]._serialize();
    });
    return {
      render: this.render,
      outlets
    };
  }
}

export const RouteBuilder = Ember.Service.extend({
  makeRoute(args) {
    if (args.template) {
      args.template = this._prepareTemplate(args.template);
    }
    return new RouteInfo(this, args);
  },
  _prepareTemplate(compiled) {
    let name = `template:${Ember.guidFor({})}`;
    let owner = Ember.getOwner(this);
    owner.register(name, compiled);
    return owner.lookup(name);
  }
});

let usingGlimmer2;
try {
  let emberRequire = Ember.__loader.require;
  emberRequire('ember-glimmer');
  usingGlimmer2 = true;
} catch(err)  {
  usingGlimmer2 = false;
}

export const SetRouteComponent = Ember.Component.extend({
  tagName: '',
  layout: hbs`{{#-with-dynamic-vars outletState=state}}{{yield}}{{/-with-dynamic-vars}}`,
  didReceiveAttrs() {
    // before glimmer2, outlets aren't really data-down. We need to
    // trigger revalidation manually. This is only an issue during
    // tests, because we only set outlet states during real
    // transitions anyway.
    if (!usingGlimmer2) {
      this.rerender();
    }
  }
});
