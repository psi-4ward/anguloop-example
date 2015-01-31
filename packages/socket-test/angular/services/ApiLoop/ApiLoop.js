app.provider('ApiLoop', function() {

  var ApiLoopProvider = this;

  this.config = {
    connector: '$http',
    urlPrefix: '/api',
    events: {
      "collection:beforeFetch": [],
      "collection:afterFetch": [],
      "model:create": []
    }
  };

  this.$get = function($q, $injector) {

    function ApiLoop(config) {
      if(! this instanceof ApiLoop) return new ApiLoop(config);

      // merge config
      this.config = angular.extend({}, ApiLoopProvider.config, config || {});

      // resolve connector injectable service
      if(angular.isString(this.config.connector)) this.config.connector = $injector.get(this.config.connector);

      this.collectionRegistry = {};
    }

    ApiLoop.prototype.collection = function collection(name, filter, config) {
      return new Collection(name, filter, this.config);

      // do we need a registry here?
      /*var ident = name + (filter && JSON.stringify(filter) || '');
      if(!this.collectionRegistry[ident]) {
        this.collectionRegistry[ident] = new Collection(name, filter, this.config);
      }
      return this.collectionRegistry[ident];*/
    };

    // Model factory?

    ApiLoop.prototype.createService = function(config) {
      return new ApiLoop(config);
    };

    // mixin standard methods from connector
    ['get', 'post', 'put', 'delete', 'head', 'options'].forEach(function(method) {
      ApiLoop.prototype[method] = function() {
        var args = [].slice.call(arguments);
        args[0] = this.urlPrefix + args[0];
        return this.connector[method].apply(this, args);
      };
    });

    return new ApiLoop();
  };

  this.helpers = {
    addSchemaFetcher: function() {
      // fetch schema on Collection.fetch()
      ApiLoopProvider.config.events['collection:beforeFetch'].push(function() {
        var self = this;
        if(this._config.schema) return this;
        return this.get('/_meta').then(function(res) {
          self._config.schema = res.data.schema;
          return self; // resolve to the Collection
        });
      });

      // respect schema defaults when creating models
      ApiLoopProvider.config.events['model:create'].push(function() {
        if(!this._config.schema) return;
        var self = this;
        angular.forEach(this._config.schema.properties, function(data, prop) {
          if(data.default && typeof self[prop] === 'undefined') self[prop] = data.default;
        });
      });
    },

    addModelUpdater: function() {
      // apply model-updater
      ApiLoopProvider.config.events['collection:afterFetch'].push(function() {
        if(!this._config.connector.$modelUpdater) throw new Error('Connector must implement $modelUpdater');
        // remove a prev updater
        if(this._modelUpdaterFunc) this._config.connector.rawSocket.removeEventListener('data', this._modelUpdaterFunc);
        this._modelUpdaterFunc = this._config.connector.$modelUpdater(this.name, this.models, this.filter);
        return this;
      });
    }
  };

});