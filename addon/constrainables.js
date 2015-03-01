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
      var value = versionValue(conditions, 1);
      if (value && value.render) {
        return [value.render.name];
      }
    }
  },
  newRoute: {
    reversesTo: 'oldRoute',
    accessor: function(conditions) {
      var value = versionValue(conditions, 0);
      if (value && value.render) {
        return [value.render.name];
      }
    }
  },
  helperName: {},
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
};

function versionValue(conditions, index) {
  var versions = conditions.versions;
  return versions[index] ? versions[index].value : null;
}
