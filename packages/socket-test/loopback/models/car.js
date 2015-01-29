module.exports = function(Car) {
  Car._meta = function(cb) {
    cb(null, Car.settings.schema);
  };

  Car.remoteMethod(
    '_meta',
    {
      http: {
        verb: 'get'
      },
      description: 'Get the JSON Schema for the Model',
      returns: {arg: 'schema', type: 'object', root: true}
    }
  );
};
