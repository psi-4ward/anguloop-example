var tv4 = require('tv4');

module.exports = function(app) {

  // Add schema-validation to each model
  Object.keys(app.models).forEach(function(m) {
    var Model = app.models[m];

    if(!Model.settings.schema) return;

    Model.validate('JsonSchema', function(err) {
      var validator = this;

      var result = tv4.validateMultiple(this.__data, Model.settings.jsonSchema, true, Model.settings.strictJsonSchema || false);
      if(!result.valid) {
        // Add errors to validator
        result.errors.forEach(function(err) {
          validator.errors.add(
            err.dataPath.substr(1).replace('/', '.'),
            err.message,
            'invalid'
          );
        });
        err(false); // supporess JsonSchema-Validator error
      }
    });
  });
};