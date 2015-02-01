var excludeMethods = [
  'create', 'upsert', 'exists', 'findById', 'find', 'findOne',
  'updateAll', 'deleteById', 'count', '_meta', 'updateAttributes'];

module.exports = function(app) {
  Object.keys(app.models).forEach(function(m) {
    var Model = app.models[m];

    // define the _meta method for each model
    Model._meta = function(cb) {
      var ret = {
        // expose JsonSchema
        schema: Model.settings.jsonSchema,
        methods: []
      };

/*      // expose remote methods
      Model.sharedClass.methods().forEach(function(method) {
        if(!method.shared) return;

        // exclude default REST methods
        if(excludeMethods.indexOf(method.name) > -1) return;

        // exclude methods starting with "__", they are relation-methods
        if(method.name.substr(0, 2) === '__') return;

        ret.methods.push({
          method: (method.http.verb || 'GET').toUpperCase(),
          name: method.name,
          path: method.http.path,
          isStatic: method.isStatic,
          args: method.accepts.map(function(arg) {
            return {
              name: arg.arg,
              isBody: arg.http && arg.http.source === 'body'
            };
          })
        });
      });*/

      cb(null, ret);
    };

    // expose as remoteMethod in RESTapi
    Model.remoteMethod('_meta', {
      http: {
        verb: 'get'
      },
      accessType: 'READ',
      description: 'Get Model metadata like JSON Schema and remote methods',
      returns: {arg: 'meta', type: 'object', root: true}
    });

  });
};