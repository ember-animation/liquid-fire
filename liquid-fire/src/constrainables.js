import { childRoute, routeName, routeModel } from './ember-internals';

export default {
  oldValue: {
    reversesTo: 'newValue',
    accessor: function (conditions) {
      return [versionValue(conditions, 1)];
    },
  },
  newValue: {
    reversesTo: 'oldValue',
    accessor: function (conditions) {
      return [versionValue(conditions, 0)];
    },
  },
  oldRoute: {
    reversesTo: 'newRoute',
    accessor: function (conditions) {
      return routeName(
        childRoute(
          versionValue(conditions, 1),
          conditions.matchContext.outletName,
        ),
      );
    },
  },
  newRoute: {
    reversesTo: 'oldRoute',
    accessor: function (conditions) {
      return routeName(
        childRoute(
          versionValue(conditions, 0),
          conditions.matchContext.outletName,
        ),
      );
    },
  },
  oldModel: {
    reversesTo: 'newModel',
    accessor: function (conditions) {
      return routeModel(
        childRoute(
          versionValue(conditions, 1),
          conditions.matchContext.outletName,
        ),
      );
    },
  },
  newModel: {
    reversesTo: 'oldModel',
    accessor: function (conditions) {
      return routeModel(
        childRoute(
          versionValue(conditions, 0),
          conditions.matchContext.outletName,
        ),
      );
    },
  },
  helperName: {
    accessor(conditions) {
      return conditions.matchContext.helperName;
    },
  },
  outletName: {
    accessor(conditions) {
      return conditions.matchContext.outletName;
    },
  },
  parentElementClass: {
    accessor: function (conditions) {
      const cls = conditions.parentElement.getAttribute('class');
      if (cls) {
        return cls.split(/\s+/);
      }
    },
  },
  parentElement: {},
  firstTime: {},
  media: {},
};

function versionValue(conditions, index) {
  const versions = conditions.versions;
  return versions[index] ? versions[index].value : null;
}
