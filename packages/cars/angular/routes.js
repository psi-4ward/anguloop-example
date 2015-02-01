app.config(function($stateProvider) {
  $stateProvider.state({
    name: 'root.cars',
    url: '/cars',
    controller: "CarsController",
    controllerAs: "CarsController",
    templateUrl: 'cars/templates/cars.html',
    resolve: {
      Cars: function(ApiLoop) {
        return ApiLoop.collection('cars').fetch();
      }
    },
    ncyBreadcrumb: {
      label: 'Cars'
    }
  });

  $stateProvider.state({
    name: 'root.cars.edit',
    url: '/:carId',
    views: {
      'editCar': {
        templateUrl: 'alTheme/templates/generic-form.html',
        controller: 'GenericFormController',
        controllerAs: 'FormController'
      }
    },
    resolve: {
      Model: function($stateParams, Cars) {
        return Cars.findOrCreate($stateParams.carId);
      }
    },
    ncyBreadcrumb: {
      label: ''
    },
    onEnter: function(Model) {
      this.ncyBreadcrumb.label = (Model && Model.name) ? Model.name : 'new Car';
    }
  });

  $stateProvider.state({
    name: 'root.cars.drivers',
    url: '/:carId/drivers',
    controller: "DriversController",
    controllerAs: "DriversController",
    templateUrl: 'cars/templates/drivers.html',
    resolve: {
      Car: function($stateParams, Cars) {
        return Cars.findOrCreate($stateParams.carId);
      },
      Drivers: function($stateParams, Car) {
        return Car.collection('drivers').fetch();
      }
    },
    ncyBreadcrumb: {
      label: 'Drivers'
    },
    onEnter: function(Car) {
      this.ncyBreadcrumb.label = Car.name + ' drivers';
    }
  });


  $stateProvider.state({
    name: 'root.cars.drivers.edit',
    url: '/:driverId',
    views: {
      'editDriver': {
        templateUrl: 'alTheme/templates/generic-form.html',
        controller: 'GenericFormController',
        controllerAs: 'FormController'
      }
    },
    resolve: {
      Model: function($stateParams, Drivers) {
        return Drivers.findOrCreate($stateParams.driverId);
      }
    },
    ncyBreadcrumb: {
      label: ''
    },
    onEnter: function(Model) {
      this.ncyBreadcrumb.label = (Model && Model.name) ? Model.name : 'new Driver';
    }
  });  
});