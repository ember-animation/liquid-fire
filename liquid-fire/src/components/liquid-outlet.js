import Component from '@glimmer/component';
import { childRoute, routeIsStable, modelIsStable } from '../ember-internals';

export default class LiquidOutletComponent extends Component {
  get outletName() {
    return this.args.inputOutletName || 'main';
  }

  get versionEquality() {
    const outletName = this.outletName;
    const watchModels = this.args.watchModels;
    return function (oldValue, newValue) {
      const oldChild = childRoute(oldValue, outletName);
      const newChild = childRoute(newValue, outletName);
      return (
        routeIsStable(oldChild, newChild) &&
        (!watchModels || modelIsStable(oldChild, newChild))
      );
    };
  }
}
