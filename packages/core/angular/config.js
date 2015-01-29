// router config
app.config(function($locationProvider, $urlRouterProvider, $compileProvider) {
  $urlRouterProvider.otherwise('/dash');
  //$compileProvider.debugInfoEnabled(false);
});
app.run(function($rootScope, $log) {
  $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, e) {
    $log.error(e.stack || e);
  });
});

// Breadcrumb config
app.config(function($breadcrumbProvider) {
  $breadcrumbProvider.setOptions({
    template:
      '<div class="breadcrumb">' +
        '<a ng-repeat="step in steps" class="btn btn-flat" ui-sref="{{step.name}}" ng-disabled="$last">{{step.ncyBreadcrumbLabel}}</a>' +
      '</div>'
  });
});

// schema form config
app.config(function(schemaFormProvider, $provide) {
  schemaFormProvider.postProcess(function(form) {
    _.remove(form, {title: 'id'});
    angular.forEach(form, function(fld) {
      if(fld.feedback === undefined) fld.feedback = "{'fa': true, 'fa-check': ngModel.$valid && ngModel.$dirty, 'fa-exclamation-circle': ngModel.$invalid && ngModel.$dirty}";
      if(!fld.ngModelOptions) fld.ngModelOptions = {
        updateOn: 'default blur click',
        debounce: {'default': 500, 'blur': 0, 'click': 0}
      };
    });
    return form;
  });

  // monky patch schemaValidate to show hasSuccess only for $dirty fields
  $provide.decorator('schemaValidateDirective', function($delegate) {
    var directive = $delegate[0];
    var linkFnk = directive.link;
    directive.compile = function() {
      return function(scope, element, attrs, ngModel) {
        linkFnk.apply(null, arguments);

        scope.hasSuccess = function() {
          return ngModel.$valid && ngModel.$dirty;
        };
      };
    };
    return $delegate;
  });
});

