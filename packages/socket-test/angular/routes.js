app.config(function($stateProvider) {
  $stateProvider.state({
    name: 'root.cars',
    url: '/cars',
    controller: "CarsController",
    controllerAs: "CarsController",
    templateUrl: 'socket-test/templates/cars.html',
    resolve: {
      Cars: function(ApiLoop) {
        return ApiLoop.collection('cars').fetch();
      }
    }
  });
});