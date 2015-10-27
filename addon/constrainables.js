import { routeName, routeModel } from "liquid-fire/ember-internals";

export default {
  oldValue : {
    reversesTo: 'newValue',
    accessor: function(conditions) {
      return [versionValue(conditions, 1)];
    }
  },
  newValue: {
    reversesTo: 'oldValue',
    accessor: function(conditions) {
      return [versionValue(conditions, 0)];
    }
  },
  oldRoute: {
    reversesTo: 'newRoute',
    accessor: function(conditions) {
      return routeName(versionValue(conditions, 1));
    }
  },
  newRoute: {
    reversesTo: 'oldRoute',
    accessor: function(conditions) {
      return routeName(versionValue(conditions, 0));
    }
  },
  oldModel: {
    reversesTo: 'newModel',
    accessor: function(conditions) {
      return routeModel(versionValue(conditions, 1));
    }
  },
  newModel: {
    reversesTo: 'oldModel',
    accessor: function(conditions) {
      return routeModel(versionValue(conditions, 0));
    }
  },
  helperName: {},
  outletName: {},
  parentElementClass: {
    accessor: function(conditions) {
      var cls = conditions.parentElement.attr('class');
      if (cls) {
        return cls.split(/\s+/);
      }
    }
  },
  parentElement: {},
  firstTime: {},
  oldModalComponent: {
    reversesTo: 'newModalComponent',
    accessor: function(conditions) {
      var value = versionValue(conditions, 1);
      if (value) {
        return [value.name];
      }
    }
  },
  newModalComponent: {
    reversesTo: 'oldModalComponent',
    accessor: function(conditions) {
      var value = versionValue(conditions, 0);
      if (value) {
        return [value.name];
      }
    }
  },
  media: {}
};

function versionValue(conditions, index) {
  var versions = conditions.versions;
  return versions[index] ? versions[index].value : null;
}
