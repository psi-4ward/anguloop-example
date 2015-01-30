module.exports = function(app) {
  Object.keys(app.models).forEach(function(m) {
    var Model = app.models[m];

    // define the _meta method for each model
    Model._meta = function(cb) {
      cb(null, Model.settings.schema);
    };

    // expose as remoteMethod in RESTapi
    Model.remoteMethod('_meta', {
      http: {
        verb: 'get'
      },
      description: 'Get the JSON Schema for the Model',
      returns: {arg: 'schema', type: 'object', root: true}
    });
  });
};