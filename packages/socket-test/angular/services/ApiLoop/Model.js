function Model(name, data, config) {
  if(!this instanceof Model) return new Model(name, data, config);

  var self = this;
  this._config = config;
  this._config.name = name;
  if(!this._config.connector) throw new Error('Model needs an $http like connector');
  if(data) _.merge(this, data);

  // run all onAfterFetch hooks
  angular.forEach(this._config.events['model:create'], function(fnk) {
    fnk.call(self);
  });
}


Model.prototype.save = function save() {
  var self = this;
  var id = this[this._config.idProperty];
  var url = this._config.urlPrefix + this._config.url;

  if(!id) {
    // create
    return this._config.connector.post(url, this.toJSON())
      .then(function(res) {
        self.updateData(res.data);
        var col = self.getCollection();
        if(col) col.add(self);
        return self;
      });
  } else {
    return this._config.connector.put(url + '/' + id, this.toJSON())
      .then(function(res) {
        self.updateData(res.data);
        return self;
      });
  }
};


Model.prototype.destroy = function() {
  var self = this;
  var url = this._config.urlPrefix + this._config.url;
  if(!this.id) throw new Error('Cant delete a Model without ID');
  return this._config.connector.delete(url + '/' + this.id)
    .then(function() {
      var col = self.getCollection();
      if(col) col.removeById(self.id);
    });
};


Model.prototype.updateData = function updateData(data) {
  _.merge(this, data);
};


Model.prototype.toJSON = function toJSON() {
  return _.omit(this, function(val, key) {
    if(key.substr(0, 1) === '_' || key === 'createdAt' || key === 'updatedAt') return true;
    if(_.isFunction(val) || (_.isObject(val) && !_.isPlainObject(val) && !_.isArray(val))) return true;
  });
};


Model.prototype.getCollection = function getCollection() {
  return this._config.collection;
};


Model.prototype.collection = function collection(name, filter, config) {
  if(!this.id) throw new Error('Can retrieve subcollections for a model without ID');
  config = angular.extend({}, this._config, config);
  config.url += '/' + this.id + '/' + name;
  return new Collection(name, filter, config);
};


// mixin standard methods from connector
['get', 'post', 'put', 'delete', 'head', 'options'].forEach(function(method) {
  Model.prototype[method] = function() {
    var args = [].slice.call(arguments);
    args[0] = this._config.urlPrefix + args[0];
    return this._config.connector[method].apply(this, args);
  };
});