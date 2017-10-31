import { equal } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  vehicle: 'bike',
  vehicles: ['bike', 'car'],
  states: ['', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT'],
  isBike: equal('vehicle', 'bike')
});
