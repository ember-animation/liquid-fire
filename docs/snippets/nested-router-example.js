import EmberRouter from '@ember/routing/router';
import config from 'docs/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
}

Router.map(function () {
  this.route('posts', function () {
    this.route('new');
  });
});
