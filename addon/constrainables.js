export default {
  oldValue : {
    reversesTo: 'newValue',
    accessor: function(conditions) {
      return [versionValue(conditions, false)];
    }
  },
  newValue: {
    reversesTo: 'oldValue',
    accessor: function(conditions) {
      return [versionValue(conditions, true)];
    }
  },
  oldRoute: {
    reversesTo: 'newRoute',
    accessor: function(conditions) {
      var value = versionValue(conditions, false);
      if (value && value.render) {
        return [value.render.name];
      }
    }
  },
  newRoute: {
    reversesTo: 'oldRoute',
    accessor: function(conditions) {
      var value = versionValue(conditions, true);
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
  firstTime: {}
};

function versionValue(conditions, newFlag) {
  var versions = conditions.versions;
  var length = versions.length;
  var version;
  for (var i = 0; i < length; i++) {
    version = versions[i];
    if (newFlag ? version.isNew : !version.isNew) {
      return version.value;
    }
  }
}
