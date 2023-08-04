import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ScenariosController extends Controller {
  queryParams = ['testSalutation', 'testPerson'];

  @tracked testSalutation = null;
  @tracked testPerson = null;

  @action
  changeSalutation() {
    this.testSalutation = 'Hola';
  }
}
