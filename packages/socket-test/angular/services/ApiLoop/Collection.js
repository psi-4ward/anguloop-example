function Collection(name, filter, config) {
  if(!this instanceof Collection) return new Collection(name, filter, config);

  this.models = [];
  this.name = name;
  this.filter = filter;
  this._config = angular.extend({
    connector: null,
    collection: this
  }, config || {});
  if(!this._config.url) this._config.url = '/' + name;

  if(!this._config.connector) throw new Error('Collection needs a $http like service');
}


Collection.prototype.find = function find(what) {
  return _.find(this.models, what);
};


Collection.prototype.findById = function findById(id) {
  return _.find(this.models, {id: id});
};


Collection.prototype.findOrCreate = function findOrCreate(id) {
  if(id === '_new') return this.createModel();
  return this.findById(id) || this.createModel();
};


Collection.prototype.add = function add(Model) {
  var i;
  if(Model.id && (i = _.findIndex(this.models, {id: Model.id})) > -1) {
    // model with same id already exists -> replace
    this.models.splice(i, 1, Model);
  } else {
    this.models.push(Model);
  }
};


Collection.prototype.remove = function remove(Model) {
  _.remove(this.models, Model);
};


Collection.prototype.removeById = function removeById(id) {
  _.remove(this.models, {id: id});
};


Collection.prototype.createModel = function createModel(data) {
  return new Model(this.name, data, this._config);
};


Collection.prototype.fetch = function fetch() {
  var self = this;
  var prom;

  function fetchRows() {
    var url = self._config.urlPrefix + self._config.url;
    if(self.filter) url += '?filter=' + encodeURIComponent(JSON.stringify(self.filter));
    return self._config.connector.get(url)
      .then(function response(res) {
        angular.forEach(res.data, function(row) {
          self.add(self.createModel(row));
        });
        return self;
      });
  }

  // run all beforeFetch hooks
  angular.forEach(this._config.events['collection:beforeFetch'], function(fnk) {
    if(!prom) prom = fnk.call(self);
    else prom = prom.then(fnk.bind(self));
  });

  // fetch rows
  if(prom) prom = prom.then(fetchRows);
  else prom = fetchRows();

  // run all afterFetch hooks
  angular.forEach(this._config.events['collection:afterFetch'], function(fnk) {
    prom = prom.then(fnk.bind(self));
  });

  return prom;
};

Collection.prototype.collection = function collection(name, filter, config) {
  config = angular.extend({}, this._config, config);
  config.url += '/' + name;
  return new Collection(name, filter, config);
};

// mixin standard methods from connector
['get', 'post', 'put', 'delete', 'head', 'options'].forEach(function(method) {
  Collection.prototype[method] = function() {
    var args = [].slice.call(arguments);
    args[0] = this._config.urlPrefix + this._config.url + args[0];
    return this._config.connector[method].apply(this._config.connector, args);
  };
});