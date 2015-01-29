app.config(function($stateProvider) {
  $stateProvider.state({
    name: 'root.cars',
    url: '/cars',
    controller: "CarsController",
    controllerAs: "CarsController",
    templateUrl: 'socket-test/templates/cars.html',
    resolve: {
      ModelSchema: function($httpSock) {
        return $httpSock.get('/cars/_meta').getBody();
      }
    }
  });
});