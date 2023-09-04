import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class HelpersDocumentationLiquidSpacerController extends Controller {
  @tracked longMessage =
    'This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. ';
  @tracked shortMessage = 'Hi.';
  @tracked showLongMessage = true;
}
