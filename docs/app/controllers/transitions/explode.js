import { A } from '@ember/array';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

let i = 0;
let photos = [
  '/images/team/ykatz.jpg',
  '/images/team/tdale.jpg',
  '/images/team/pwagenet.jpg',
  '/images/team/tglowaki.jpg',
  '/images/team/ebryn.jpg',
  '/images/team/kselden.jpg',
  '/images/team/spenner.jpg',
  '/images/team/lsilber.jpg',
  '/images/team/amatchneer.jpg',
  '/images/team/rjackson.jpg',
  '/images/team/iterzic.jpeg',
  '/images/team/mbeale.jpg',
  '/images/team/efaulkner.jpg',
].map((url) => {
  return {
    url: 'http://emberjs.com' + url,
    id: i++,
  };
});

export default class TransitionsPredefinedController extends Controller {
  @tracked photos = photos.slice();
  @tracked showDetail = false;

  @action
  toggleDetail() {
    this.showDetail = !this.showDetail;
  }

  @action
  shuffle() {
    this.photos.forEach((photo) => {
      photo._randomPosition = Math.random();
    });
    this.photos = A(this.photos).sortBy('_randomPosition');
  }
}
