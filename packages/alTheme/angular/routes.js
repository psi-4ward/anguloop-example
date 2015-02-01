app.config(function($stateProvider, rootResolveProvider) {
  $stateProvider.state({
    name: 'root',
    url: '',
    templateUrl: 'alTheme/templates/root.html',
    'abstract': true,
    resolve: rootResolveProvider.resolve
  });
});
