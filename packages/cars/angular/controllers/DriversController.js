/* global app */
app.controller('DriversController', function(Drivers, PsiDialog, $scope) {
  var DriversController = this;
  this.drivers = Drivers.models;

  this.schema = Drivers._config.schema;
  this.form = ['*', {
    type: "submit",
    title: "Save"
  }];

  this.destroy = function(driver) {
    PsiDialog.confirm('Really destroy ' + driver.name + '?')
      .then(function() {
        driver.destroy();
      });
  };

  this.edit = function(driver) {
    DriversController.newEditDriver = angular.copy(driver);

  };

  this.newDriver = function() {
    DriversController.newEditDriver = Drivers.createModel();
  };

  this.save = function() {
    function done() {
      $scope.driverForm.$setPristine();
      DriversController.newEditDriver = false;
    }
    DriversController.newEditDriver.save().then(done);
  };
});