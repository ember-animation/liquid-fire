import Ember from 'ember';

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
