import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['warn'],
  warn: 0,

  tableOfContents: function(){
    return [
      { route: "index",   title: "Introduction"},
      { route: "installation",   title: "Installation & Compatibility"},
      { route: "cookbook",   title: "Cookbook"},
      { route: "helpers-documentation", title: "Template Helpers",
        children: [
          {route: "helpers-documentation.liquid-outlet", title: "liquid-outlet"},
          {route: "helpers-documentation.liquid-bind", title: "liquid-bind (inline form)"},
          {route: "helpers-documentation.liquid-bind-block", title: "liquid-bind (block form)"},
          {route: "helpers-documentation.liquid-if", title: "liquid-if"},
          {route: "helpers-documentation.liquid-spacer", title: "liquid-spacer"}
        ]
      },
      { route: 'transition-map', title: 'Transition Map',
        children: [
          {route: 'transition-map.route-constraints', title: 'Matching by route & model'},
          {route: 'transition-map.outlet-constraints', title: 'Matching by outlet'},
          {route: 'transition-map.value-constraints', title: 'Matching by value'},
          {route: 'transition-map.media-constraints', title: 'Matching by media query'},
          {route: 'transition-map.dom-constraints', title: 'Matching by DOM context'},
          {route: 'transition-map.initial-constraints', title: 'Matching initial renders'},
          {route: 'transition-map.choosing-transitions', title: 'Choosing transition animations'},
          {route: 'transition-map.debugging-constraints', title: 'Debugging transition matching'}
        ]
      },
      { route: 'transitions', title: 'Transitions',
        children: [
          {route: 'transitions.predefined', title: "Predefined transitions"},
          {route: 'transitions.explode', title: "explode"},
          {route: 'transitions.defining', title: 'Defining custom transitions'},
          {route: 'transitions.primitives', title: 'Animation Primitives'}
        ]
      },
      { route: 'modal-documentation', title: 'Modal Dialogs',
        children: [
          {route: 'modal-documentation.modal', title: 'modal()'},
          {route: 'modal-documentation.component', title: 'Modal Components'},
          {route: 'modal-documentation.animation', title: 'Customizing Animation'}
        ]
      }
    ];
  }.property(),

  flatContents: function(){
    var flattened = [];
    this.get('tableOfContents').forEach(function(entry) {
      flattened.push(entry);
      if (entry.children){
        flattened = flattened.concat(entry.children);
      }
    });
    return flattened;
  }.property('tableOfContents'),


  currentIndex: function(){
    var contents = this.get('flatContents'),
        current = this.get('currentRouteName'),
        bestMatch,
        entry;

    for (var i=0; i<contents.length; i++) {
      entry = contents[i];
      if (entry.route && new RegExp('^' + entry.route.replace(/\./g, '\\.')).test(current)) {
        if (typeof(bestMatch) === 'undefined' || contents[bestMatch].route.length < entry.route.length) {
          bestMatch = i;
        }
      }
    }
    return bestMatch;
  }.property('currentRouteName', 'flatContents'),

  nextTopic: function(){
    var contents = this.get('flatContents'),
        index = this.get('currentIndex');
    if (typeof(index) !== "undefined") {
      return contents[index+1];
    }
  }.property('currentIndex', 'flatContents'),

  prevTopic: function(){
    var contents = this.get('flatContents'),
        index = this.get('currentIndex');
    if (typeof(index) !== "undefined") {
      return contents[index-1];
    }
  }.property('currentIndex', 'flatContents')

});
