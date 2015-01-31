// router config
app.config(function($locationProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/cars');
});

app.config(function(ApiLoopProvider) {
  ApiLoopProvider.config.connector = '$httpSock';
  ApiLoopProvider.config.urlPrefix = '';
  ApiLoopProvider.helpers.addSchemaFetcher();
  ApiLoopProvider.helpers.addModelUpdater();
});

