import Ember from "ember";

/*
   This is a nearly-verbatim copy of the stock eachHelper, except we
   inject our own custom view class, and we punt on supporting
   GroupedEach.
*/

export default function liquidEachHelper(path, options) {
  var ctx;
  var helperName = 'liquid-each';

  if (arguments.length === 4) {
    Ember.assert("If you pass more than one argument to the each helper, it must be in the form #each foo in bar", arguments[1] === "in");

    var keywordName = arguments[0];

    options = arguments[3];
    path = arguments[2];

    helperName += ' ' + keywordName + ' in ' + path;

    if (path === '') { path = "this"; }

    options.hash.keyword = keywordName;

  } else if (arguments.length === 1) {
    options = path;
    path = 'this';
  } else {
    helperName += ' ' + path;
  }

  var View = options.data.view.container.lookupFactory('view:liquid-each');

  options.hash.dataSourceBinding = path;
  ctx = this || window;

  options.helperName = options.helperName || helperName;

  if (options.data.insideGroup && !options.hash.groupedRows && !options.hash.itemViewClass) {
    Ember.assert("liquid-each doesn't support grouping", false);
  } else {
    return Ember.Handlebars.helpers.collection.call(ctx, View, options);
  }
}
