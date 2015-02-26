var tv4 = require('tv4');
var _ = require('lodash');

module.exports = function(app) {

  // Add schema-validation to each model
  Object.keys(app.models).forEach(function(m) {
    var Model = app.models[m];

    if(!Model.settings.jsonSchema) return;

    Model.validate('JsonSchema', function(err) {
      var validator = this;

      var data = _.omit(this, function(val, key) {
        if(key.substr(0, 1) === '__' || _.isFunction(val) || key === 'errors') return true;
      });
      
      
      var result = tv4.validateMultiple(data, Model.settings.jsonSchema, true, Model.settings.strictJsonSchema || false);
      if(!result.valid) {
        // Add errors to validator
        result.errors.forEach(function(err) {
          validator.errors.add(
            err.dataPath.substr(1).replace('/', '.'),
            err.message,
            'invalid'
          );
        });
        err(false); // suppress JsonSchema-Validator error
      }
    });
  });
};
