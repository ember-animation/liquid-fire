import { equal } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  vehicle: 'bike',
  vehicles: computed(function () {
    return ['bike', 'car'];
  }),
  states: computed(function () {
    return ['', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT'];
  }),
  isBike: equal('vehicle', 'bike'),
});
