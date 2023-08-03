import Component from '@glimmer/component';
import {
  childRoute,
  routeIsStable,
  modelIsStable,
} from '../ember-internals';

export default class LiquidOutletComponent extends Component {
  get outletName() {
    return this.args.inputOutletName || 'main';
  }

  get versionEquality() {
    let outletName = this.outletName;
    let watchModels = this.args.watchModels;
    return function (oldValue, newValue) {
      let oldChild = childRoute(oldValue, outletName);
      let newChild = childRoute(newValue, outletName);
      return (
        routeIsStable(oldChild, newChild) &&
        (!watchModels || modelIsStable(oldChild, newChild))
      );
    };
  }
}
