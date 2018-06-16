import { equal } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  vehicle: 'bike',
  vehicles: Object.freeze(['bike', 'car']),
  states: Object.freeze(['', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT']),
  isBike: equal('vehicle', 'bike')
});
