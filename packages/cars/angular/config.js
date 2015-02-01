app.config(function(ApiLoopProvider) {
  ApiLoopProvider.config.connector = '$httpSock';
  ApiLoopProvider.config.urlPrefix = '';
  ApiLoopProvider.enableSchemaFetcher();
  ApiLoopProvider.enableModelUpdater();
});

