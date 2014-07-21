import Ember from "ember";

export default Ember.Controller.extend({
  vehicle: 'bike',
  vehicles: ['bike', 'car'],
  states: ['', 'AL', 'AK', 'AZ', 'AR'],
  isBike: Ember.computed.equal('vehicle', 'bike')
});
