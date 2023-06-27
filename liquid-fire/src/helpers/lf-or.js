import { helper } from '@ember/component/helper';

export function lfOr(params /*, hash*/) {
  return params.reduce((a, b) => a || b, false);
}

export default helper(lfOr);
