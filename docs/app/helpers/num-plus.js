import { helper } from '@ember/component/helper';

export function plusHelper(params) {
  return parseInt(params[0]) + parseInt(params[1]);
}

export default helper(plusHelper);
