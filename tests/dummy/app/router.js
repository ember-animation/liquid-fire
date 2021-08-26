import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  /* Interactive Documentation */
  this.route('installation');
  this.route('cookbook');
  this.route('helpers-documentation', { path: 'helpers' }, function () {
    this.route('liquid-outlet', function () {
      this.route('other');
    });
    this.route('liquid-bind');
    this.route('liquid-bind-block', function () {
      this.route('page', { path: '/:id' });
    });
    this.route('liquid-if');
    this.route('liquid-spacer');
  });

  this.route('transition-map', function () {
    this.route('route-constraints');
    this.route('outlet-constraints');
    this.route('value-constraints');
    this.route('media-constraints');
    this.route('dom-constraints');
    this.route('initial-constraints');
    this.route('choosing-transitions');
    this.route('debugging-constraints');
  });

  this.route('transitions', function () {
    this.route('predefined');
    this.route('explode');
    this.route('defining');
    this.route('primitives', function () {
      this.route('two');
      this.route('three');
    });
  });

  /* Test Scenarios */

  this.route('scenarios', function () {
    this.route('inline');
    this.route('inline-serial');
    this.route('empty-if');
    this.route('growable-with');
    this.route('growable-flexboxes');
    this.route('nested-outlets', function () {
      this.route('middle', function () {
        this.route('inner');
        this.route('inner2');
      });
      this.route('middle2');
    });
    this.route('table-row');
    this.route('spacer');
    this.route('versions');
    this.route('hero');
    this.route('model-dependent-rule', function () {
      this.route('page', { path: '/:id' });
      this.route('other', { path: '/other/:id' });
    });
    this.route('interrupted-move', function () {
      this.route('two');
      this.route('three');
    });
    this.route('in-test-outlet');
    this.route('nested-explode-transition');
  });
});
