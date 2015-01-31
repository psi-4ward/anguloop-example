/* global app */
app.controller('CarsController', function(Cars, $httpSock, PsiDialog, $scope) {
  var CarsController = this;
  this.cars = Cars.models;

/*
  this.drivers = Cars.findById(1).collection('drivers').fetch().then(function(Drivers) {
    var d = Drivers.createModel({name: 'Nina', age: 23});
    d.save();
  });

  Cars.get('random');
*/


  this.schema = Cars._config.schema;
  this.form = ['*', {
    type: "submit",
    title: "Save"
  }];

  this.destroy = function(car) {
    PsiDialog.confirm('Really destroy ' + car.name + '?')
      .then(function() {
        car.destroy();
      });
  };

  this.edit = function(car) {
    CarsController.newEditCar = angular.copy(car);

  };

  this.newCar = function() {
    CarsController.newEditCar = Cars.createModel();
  };

  this.save = function() {
    function done() {
      $scope.carForm.$setPristine();
      CarsController.newEditCar = false;
    }
    CarsController.newEditCar.save().then(done);
  };
});