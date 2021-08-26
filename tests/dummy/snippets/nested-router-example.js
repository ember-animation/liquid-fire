import EmberRouter from '@ember/routing/router';
import config from './config/environment';

let Router = EmberRouter.extend({
  location: config.locationType,
});

export default Router.map(function () {
  this.route('posts', function () {
    this.route('new');
  });
});
