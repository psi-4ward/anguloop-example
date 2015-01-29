app.factory('$localStorage', _storageFactory('localStorage'));
app.factory('$sessionStorage', _storageFactory('sessionStorage'));

function _storageFactory(storageType) {
  return ['$window', '$log',

    function($window, $log) {
      var storage = $window[storageType] || $log.error('This browser does not support Web Storage!');
      
      var $storage = {
        get: function(key, defaultValue) {
          var v = storage.getItem(key);
          if(v === null) return defaultValue;
          try {
            return JSON.parse(v);
          }
          catch(e) {
            return defaultValue;
          }
        },

        set: function(key, val) {
          storage.setItem(key, JSON.stringify(val));
        },
        
        remove: function(key) {
          storage.removeItem(key);
        }
      };

      return $storage;
    }
  ];
}
