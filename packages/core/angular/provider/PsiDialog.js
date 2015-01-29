app.provider('PsiDialog', function() {

  var PsiDialogProvier = this;

  this.confirmDefaults = {
    template: 'core/templates/psi-dialog-confirm.html',
    placement: 'center',
    animation: 'am-flip-x',
    backdrop: true
  };

  this.confirmUnsavedDefaults = {
    template: 'core/templates/psi-dialog-confirm-unsaved.html',
    placement: 'center',
    animation: 'am-flip-x',
    backdrop: true
  };

  this.$get = function($modal, $rootScope, $q) {
    var PsiDialog = {

      confirm: function(msg, content, opts) {
        var confirmModal;
        var scope = $rootScope.$new(true);
        var prom = $q.defer();

        scope.ok = function() {
          confirmModal.hide();
          prom.resolve();
        };
        scope.cancel = function() {
          confirmModal.hide();
          prom.reject();
        };

        if(!opts && typeof content === 'object') {
          opts = content;
          content = false;
        }

        angular.extend(scope, PsiDialogProvier.confirmDefaults);
        if(opts) angular.extend(scope, opts);

        confirmModal = $modal({
          scope: scope,
          show: true,
          backdrop: true,
          container: 'body',
          placement: scope.placement,
          animation: scope.animation,
          template: scope.template,
          title: msg,
          content: content
        });

        return prom.promise;
      },

      confirmUnsaved: function(msg, content, opts) {
        var confirmModal;
        var scope = $rootScope.$new(true);
        var prom = $q.defer();

        scope.save = function() {
          confirmModal.hide();
          prom.resolve('save');
        };
        scope.discard = function() {
          confirmModal.hide();
          prom.resolve('discard');
        };
        scope.cancel = function() {
          confirmModal.hide();
          prom.reject();
        };

        if(!opts && typeof content === 'object') {
          opts = content;
          content = false;
        }

        angular.extend(scope, PsiDialogProvier.confirmUnsavedDefaults);
        if(opts) angular.extend(scope, opts);

        confirmModal = $modal({
          scope: scope,
          show: true,
          backdrop: true,
          container: 'body',
          placement: scope.placement,
          animation: scope.animation,
          template: scope.template,
          title: msg,
          content: content
        });

        return prom.promise;
      }


    };
    
    return PsiDialog;
  };
});