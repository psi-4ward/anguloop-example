app.config(function($stateProvider, rootResolveProvider) {
  $stateProvider.state({
    name: 'root',
    url: '',
    templateUrl: 'core/templates/root.html',
    'abstract': true,
    resolve: rootResolveProvider.resolve
  });
});
