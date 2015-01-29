app.animation('.slide-up-down-ani', function() {
  return {
    enter: function(element, done) {
      jQuery(element).css({
        display: 'none'
      }).slideDown(400, done);
    },

    leave: function(element, done) {
      jQuery(element).slideUp(400, done);
    }
  };
});