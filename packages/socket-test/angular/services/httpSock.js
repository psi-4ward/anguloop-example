/* global app,primus */

app.provider('$httpSock', function() {
  var $httpSockProvider = this;

  // the url to connect to
  this.url = undefined;

  // Prefix every request with this url
  this.urlPrefix = '/api';

  // Primus config
  this.config = {
    reconnect: {
      retries: Infinity,
      max: 3000
    }
  };

  // dump debug info to console
  this.debug = true;

  // like https://docs.angularjs.org/api/ng/service/$http#interceptors
  var interceptorFactories = this.interceptors = [
    /*function($injectables) {
       return {
         request: function(config) {},
         response: function(response) {},
         requestError: function(config) {},
         responseError: function(response) {}
       };
     }*/
  ];

  this.$get = function($q, $log, $timeout) {
    var websocket = Primus($httpSockProvider.url, $httpSockProvider.config);

    function serverRequest(config) {
      if(!config.type) config.type = 'json-web-request';
      var defer = $q.defer();
      $log.info('$httpSock request', config);
      websocket.writeAndWait(config, function(jres) {
        jres = angular.extend(config, jres); // makes this sens?
        jres.data = jres.body; // $http compat

        if(jres.error || jres.statusCode < 200 || jres.statusCode >= 300) {
          if($httpSockProvider.debug) $log.error('$httpSock response', jres);
          defer.reject(jres);
        } else {
          if($httpSockProvider.debug) $log.info('$httpSock response', jres);
          defer.resolve(jres);
        }
      });
      return defer.promise;
    }

    // build interceptor chain
    var reversedInterceptors = [];
    angular.forEach(interceptorFactories, function(interceptorFactory) {
      reversedInterceptors.unshift(
        angular.isString(interceptorFactory) ?
          $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
    });


    var $httpSock = function(config) {
      if($httpSockProvider.urlPrefix) config.url = $httpSockProvider.urlPrefix + config.url;

      var chain = [serverRequest, undefined];
      var promise = $q.when(config);

      // apply interceptors
      angular.forEach(reversedInterceptors, function(interceptor) {
        if(interceptor.request || interceptor.requestError) {
          chain.unshift(interceptor.request, interceptor.requestError);
        }
        if(interceptor.response || interceptor.responseError) {
          chain.push(interceptor.response, interceptor.responseError);
        }
      });

      // walk through the promis chain
      while(chain.length) {
        var thenFn = chain.shift();
        var rejectFn = chain.shift();
        promise = promise.then(thenFn, rejectFn);
      }

      // be $http compatible
      promise.success = function(fn) {
        promise.then(function(jres) {
          fn(jres.body, jres.statusCode, function(headerName){ return jres.headers[headerName]; }, jres);
        });
        return promise;
      };
      promise.error = function(fn) {
        promise.then(null, function(jres) {
          fn(jres.body, jres.statusCode, function(headerName) { return jres.headers[headerName]; }, jres);
        });
        return promise;
      };

      // return a promis which gets resolved to the content body
      promise.getBody = function() {
        var defer = $q.defer();
        promise.then(
          function(jres) { defer.resolve(jres.body); },
          function(jres) { defer.reject(jres.body); }
        );
        return defer.promise;
      };

      return promise;
    };

    angular.forEach(['get', 'delete'], function(method) {
      $httpSock[method] = function(url, config) {
        return $httpSock(angular.extend({
          url: url,
          method: method.toUpperCase()
        }, config || {}));
      };
    });
    angular.forEach(['post', 'put', 'patch'], function(method) {
      $httpSock[method] = function(url, data, config) {
        return $httpSock(angular.extend({
          url: url,
          body: data,
          method: method.toUpperCase()
        }, config || {}));
      };
    });

    $httpSock.on = function(event, cb) {
      websocket.on(event, function(data) {
        if($httpSockProvider.debug) $log.info('$httpSock "'+event+'" received, delegate to ' + cb.toString().split('\n')[0] + '...', data);
        $timeout(cb.bind($httpSock, data));
      });
    };
    $httpSock.once = function(event, cb) {
      websocket.once(event, function(data) {
        if($httpSockProvider.debug) $log.info('$httpSock "'+event+'" received, delegate to ' + cb.toString().split('\n')[0] + '...', data);
        $timeout(cb.bind($httpSock, data));
      });
    };

    $httpSock.rawSocket = websocket;

    $httpSock.$modelUpdater = function(modelName, arrModels) {
      $httpSock.on('data', function(msg) {
        if(!angular.isObject(msg)) return;

        var i;
        switch(msg.type) {

          case "model:changed":
            var obj;
            for(i = 0; i < arrModels.length; i++) {
              if(arrModels[i].id == msg.data.id) {
                obj = arrModels[i];
                break;
              }
            }

            if(!obj) {
              arrModels.push(msg.data);
              break;
            }

            // update the model item
            angular.extend(obj, msg.data);
            break;

          case "model:deleted":
            for(i = 0; i < arrModels.length; i++) {
              if(arrModels[i].id == msg.id) {
                arrModels.splice(i, 1);
                break;
              }
            }
            break;

          case "model:deletedAll":
            _.remove(arrModels, msg.where);
            break;
        }
      });
    };

    return $httpSock;
  };
});