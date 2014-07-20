import Ember from "ember";

export default Ember.Controller.extend({

  tableOfContents: function(){
    return [
      { route: "index",   title: "Introduction"},
      { route: "helpers", title: "Template Helpers",
        children: [
          {route: "helpers.liquid-outlet", title: "liquid-outlet"},
          {route: "helpers.liquid-with", title: "liquid-with"},
          {route: "helpers.liquid-bind", title: "liquid-bind"},
          "liquid-if",
          "liquid-measure",
          "liquid-box"
        ]
      },
      { title: 'Transition Map',
        children: [
          'Matching by route',
          'Matching by context',
          'Defining transitions'
        ]
      },
      { title: 'Transitions',
        children: [
          "Predefined transitions",
          "Custom transitions",
          "animate",
          "stop"
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
