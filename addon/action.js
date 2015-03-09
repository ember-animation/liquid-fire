import Promise from "./promise";

export default class Action {
  constructor(nameOrHandler, args=[], opts={}) {
    if (typeof nameOrHandler === 'function') {
      this.handler = nameOrHandler;
    } else {
      this.name = nameOrHandler;
    }
    this.reversed = opts.reversed;
    this.args = args;
  }

  validateHandler(transitionMap) {
    if (!this.handler) {
      this.handler = transitionMap.lookup(this.name);
    }
  }

  run(context) {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.handler.apply(context, this.args)).then(resolve, reject);
    });
  }
}
