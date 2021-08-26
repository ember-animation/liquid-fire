import { A } from '@ember/array';
import Controller from '@ember/controller';

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

export default Controller.extend({
  photos: photos.slice(),

  actions: {
    toggleDetail: function () {
      this.set('showDetail', !this.showDetail);
    },
    shuffle: function () {
      this.photos.forEach((photo) => {
        photo._randomPosition = Math.random();
      });
      this.set('photos', A(this.photos).sortBy('_randomPosition'));
    },
  },
});
