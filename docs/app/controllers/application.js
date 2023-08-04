import Controller from '@ember/controller';
import ENV from 'docs/config/environment';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service router;

  queryParams = ['warn'];

  @tracked warn = 0;

  get rootURL() {
    let url = ENV.rootURL;
    if (!/\/$/.test(url)) {
      url += '/';
    }
    return url;
  }

  get tableOfContents() {
    return [
      { route: 'index', title: 'Introduction' },
      { route: 'installation', title: 'Installation & Compatibility' },
      { route: 'cookbook', title: 'Cookbook' },
      {
        route: 'helpers-documentation',
        title: 'Template Helpers',
        children: [
          {
            route: 'helpers-documentation.liquid-outlet',
            title: 'liquid-outlet',
          },
          {
            route: 'helpers-documentation.liquid-bind',
            title: 'liquid-bind (inline form)',
          },
          {
            route: 'helpers-documentation.liquid-bind-block',
            title: 'liquid-bind (block form)',
          },
          { route: 'helpers-documentation.liquid-if', title: 'liquid-if' },
          {
            route: 'helpers-documentation.liquid-spacer',
            title: 'liquid-spacer',
          },
        ],
      },
      {
        route: 'transition-map',
        title: 'Transition Map',
        children: [
          {
            route: 'transition-map.route-constraints',
            title: 'Matching by route & model',
          },
          {
            route: 'transition-map.outlet-constraints',
            title: 'Matching by outlet',
          },
          {
            route: 'transition-map.value-constraints',
            title: 'Matching by value',
          },
          {
            route: 'transition-map.media-constraints',
            title: 'Matching by media query',
          },
          {
            route: 'transition-map.dom-constraints',
            title: 'Matching by DOM context',
          },
          {
            route: 'transition-map.initial-constraints',
            title: 'Matching initial renders',
          },
          {
            route: 'transition-map.choosing-transitions',
            title: 'Choosing transition animations',
          },
          {
            route: 'transition-map.debugging-constraints',
            title: 'Debugging transition matching',
          },
        ],
      },
      {
        route: 'transitions',
        title: 'Transitions',
        children: [
          { route: 'transitions.predefined', title: 'Predefined transitions' },
          { route: 'transitions.explode', title: 'explode' },
          {
            route: 'transitions.defining',
            title: 'Defining custom transitions',
          },
          { route: 'transitions.primitives', title: 'Animation Primitives' },
        ],
      },
    ];
  }

  get flatContents() {
    let flattened = [];
    this.tableOfContents.forEach(function (entry) {
      flattened.push(entry);
      if (entry.children) {
        flattened = flattened.concat(entry.children);
      }
    });
    return flattened;
  }

  get currentIndex() {
    const contents = this.flatContents,
      current = this.router.currentRouteName;
    let bestMatch, entry;

    for (let i = 0; i < contents.length; i++) {
      entry = contents[i];
      if (
        entry.route &&
        new RegExp('^' + entry.route.replace(/\./g, '\\.')).test(current)
      ) {
        if (
          typeof bestMatch === 'undefined' ||
          contents[bestMatch].route.length < entry.route.length
        ) {
          bestMatch = i;
        }
      }
    }
    return bestMatch;
  }

  get nextTopic() {
    const contents = this.flatContents,
      index = this.currentIndex;
    if (typeof index !== 'undefined') {
      return contents[index + 1];
    }

    return false;
  }

  get prevTopic() {
    const contents = this.flatContents,
      index = this.currentIndex;
    if (typeof index !== 'undefined') {
      return contents[index - 1];
    }

    return false;
  }
}
