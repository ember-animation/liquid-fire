import Component from '@ember/component';
import { guidFor } from '@ember/object/internals';
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import Ember from 'ember';
import { hbs } from 'ember-cli-htmlbars';

class RouteInfo {
  constructor(builder, { template, controller, name }, owner) {
    this.builder = builder;
    this.outlets = {};
    this.render = {
      template,
      controller,
      name,
      owner,
    };
  }
  setChild(name, args) {
    return (this.outlets[name] = this.builder.makeRoute(args));
  }
  asTop() {
    return {
      outlets: {
        main: this._serialize(),
      },
    };
  }
  _serialize() {
    let outlets = {};
    Object.keys(this.outlets).forEach((key) => {
      outlets[key] = this.outlets[key]._serialize();
    });
    return {
      render: this.render,
      outlets,
    };
  }
}

export const RouteBuilder = Service.extend({
  makeRoute(args) {
    if (args.template) {
      args.template = this._prepareTemplate(args.template);
    }
    return new RouteInfo(this, args, getOwner(this));
  },
  _prepareTemplate(compiled) {
    let name = `template:${guidFor({})}`;
    let owner = getOwner(this);
    owner.register(name, compiled);
    return owner.lookup(name);
  },
});

let usingGlimmer2;
try {
  let emberRequire = Ember.__loader.require;
  emberRequire('ember-glimmer');
  usingGlimmer2 = true;
} catch (err) {
  usingGlimmer2 = false;
}

export const SetRouteComponent = Component.extend({
  tagName: '',
  layout: hbs`{{#-with-dynamic-vars outletState=this.outletState}}{{yield}}{{/-with-dynamic-vars}}`,
  didReceiveAttrs() {
    this._super();
    // before glimmer2, outlets aren't really data-down. We need to
    // trigger revalidation manually. This is only an issue during
    // tests, because we only set outlet states during real
    // transitions anyway.
    if (!usingGlimmer2) {
      this.rerender();
    }
  },
});
