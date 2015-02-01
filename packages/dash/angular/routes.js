app.config(function($stateProvider) {
  var parent = 'root.';

  $stateProvider.state({
    name: parent + 'dash',
    url: '/dash',
    templateUrl: 'dash/templates/dash.html',
    ncyBreadcrumb: {
      skip: true
    }
  });
});