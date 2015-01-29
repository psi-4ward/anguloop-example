/* global app */
app.controller('CarsController', function($httpSock, ModelSchema, PsiDialog, $scope) {
  var CarsController = this;
  this.cars = [];

  // get results in a subscription
  $httpSock.get('/Cars').then(function(jres) {
    angular.extend(CarsController.cars , jres.body);
  });

  // update the cars on socket events
  $httpSock.$modelUpdater('Car', this.cars);


  this.schema = ModelSchema;
  this.form = ['*', {
    type: "submit",
    title: "Save"
  }];

  this.destroy = function(car) {
    PsiDialog.confirm('Really destroy ' + car.name + '?')
      .then(function() {
        $httpSock.delete('/Cars/'+car.id);
        // No cars-array update here, car gets removed through socket model:deleted
      });
  };

  this.edit = function(car) {
    CarsController.car = angular.copy(car);
  };

  this.save = function() {
    function done() {
      $scope.carForm.$setPristine();
      CarsController.car = {};
    }
    var car = CarsController.car;
    if(car.id) {
      $httpSock.put('/Cars/' + car.id, car).then(done);
    } else {
      $httpSock.post('/Cars', car).then(done);
    }
    // No cars-array update here, car gets updated through socket model:changed
  };
});