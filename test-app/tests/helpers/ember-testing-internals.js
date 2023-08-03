import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';

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
    const outlets = {};
    Object.keys(this.outlets).forEach((key) => {
      outlets[key] = this.outlets[key]._serialize();
    });
    return {
      render: this.render,
      outlets,
    };
  }
}

export const RouteBuilder = class RouteBuilderService extends Service {
  makeRoute(args) {
    if (args.template) {
      args.template = this._prepareTemplate(args.template);
    }
    return new RouteInfo(this, args, getOwner(this));
  }

  _prepareTemplate(compiled) {
    const name = `template:${guidFor({})}`;
    const owner = getOwner(this);
    owner.register(name, compiled);
    return owner.lookup(name);
  }
};

export const SetRouteComponent = setComponentTemplate(
  hbs`{{#-with-dynamic-vars outletState=@outletState}}{{yield}}{{/-with-dynamic-vars}}`,
  class CustomComponent extends Component {}
);
