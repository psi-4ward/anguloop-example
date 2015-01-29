app.controller('GenericFormController', function($scope, Model, PsiDialog, $state) {

  var GenericFormController = this;
  this.form = ["*"];
  this.Model = Model;
  this.schema = Model.getCollection().meta.schema;
  this.heading = Model.name || 'neu';

  var oldData = Model.toJSON();

  var saving = false;
  this.save = function() {
    saving = true;
    return Model.save().then(function() {
      $scope.sfform.$setPristine();
    }).finally(function() {
      saving = false;
    });
  };

  this.back = go.bind(this, '^');

  this.delete = function() {
    PsiDialog.confirm(this.heading + ' löschen?', {okLabel: 'löschen'})
      .then(function() {
        Model.delete().then(GenericFormController.back);
      });
  };

  // Prevent state change for $dirty form
  var clearStateChangeEvent = $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams) {
      if($scope.sfform.$pristine) return;
      event.preventDefault();
      go(toState);
    }
  );
  $scope.$on('$destroy', clearStateChangeEvent);


  function go(state) {
    if($scope.sfform.$dirty) {
      PsiDialog.confirmUnsaved('Das Dokument wurde verändert, speichern?')
        .then(function(reason) {
          clearStateChangeEvent();
          if(reason === 'save') {
            GenericFormController.save();
            $state.go(state);
          } else {
            Model.updateData(oldData);
            $state.go(state);
          }
        });
    } else {
      clearStateChangeEvent();
      $state.go(state);
    }
  }

});