import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HelpersDocumentationLiquidIfController extends Controller {
  @tracked vehicle = 'bike';
  @tracked state = '';

  vehicles = ['bike', 'car'];

  states = ['', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT'];

  get isBike() {
    return this.vehicle === 'bike';
  }

  @action
  onVehicleChange(value) {
    this.vehicle = value;
  }

  @action
  onStateChange(value) {
    this.state = value;
  }
}
