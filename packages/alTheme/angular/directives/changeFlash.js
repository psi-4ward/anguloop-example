app.directive('changeFlash', function($animate) {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {

      var running = false;
      scope.$watch(attrs.changeFlash, function() {
        if(running) return;
        running = true;

        el.addClass('highlight');

        switch(jQuery(el).prop('tagName')) {
          case 'INPUT':
              el.addClass('focus');
              setTimeout(function() {
                el.removeClass('focus');
                running = false;
              },500);
            break;

          default:
            $animate.addClass(el, 'highlight-animate').then(function() {
              el.removeClass('highlight-animate');
              running = false;
            });
            break;
        }
      });

    }
  };
});