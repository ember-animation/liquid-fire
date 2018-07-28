import { helper } from '@ember/component/helper';
import { childRoute, routeModel } from '../ember-internals';

export function lfLockModel([routeInfo, outletName]) {
  // ensures that the name is locked, see implementation of `routeModel`
  routeModel(childRoute(routeInfo, outletName));
  return routeInfo;
}

export default helper(lfLockModel);
