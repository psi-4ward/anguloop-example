var debug = require('debug')('modelChange2socket');

/**
 * PoC to broadcast model-updates via Websocket
 *
 * @todo can we support filter/includes?
 * @todo what if the spark requests serveral times with different filters?
 * @todo ACL? how can we be sure to not broadcast data which the spark can not also request via rest?
 * @todo "autoSubscribe" config
 */

module.exports = function(app) {

  // registry with models holding all sparks which wanna receive updates
  var models4sparks = {};
  
  // use remoting after hook to listen for find() executes
  app.remotes().after('**', function(ctx, next) {

    // only for websockets, this info comes from express-websocket
    if(!ctx.req.isWebsocket || ctx.method.name !== 'find') return next();


    // spark is the Primus websocket connection
    var spark = ctx.req.spark;

    //var filter = ctx.args.filter;
    var modelName = ctx.method.sharedClass.name;
    debug(modelName + '.' + ctx.method.name);

    // create a model onChanged listener in the first use
    if(!models4sparks[modelName]) {
      models4sparks[modelName] = {};

      debug('Setup ' + modelName + ' changed event');
      app.models[modelName].on('changed', function(inst) {
        var updateData = {
          type: 'model:changed',
          model: modelName,
          data: inst
        };
        debug(modelName + ' changed', updateData);

        // boradcast to all sparks
        Object.keys(models4sparks[modelName]).forEach(function(otherSparkId) {
          // can/should we omit the broadcast to the spark who
          // changed the model?
          var spark = models4sparks[modelName][otherSparkId];
          debug('broadcast ' + modelName + ' update to spark ' + spark.id);
          spark.write(updateData);
        });
      });

      debug('Setup ' + modelName + ' deleted event');
      app.models[modelName].on('deleted', function(id) {
        var delData = {
          type: 'model:deleted',
          model: modelName,
          id: id
        };
        debug(modelName + ' deleted', delData);

        // boradcast to all sparks
        Object.keys(models4sparks[modelName]).forEach(function(otherSparkId) {
          // can/should we omit the broadcast to the spark who
          // deleted the model?
          var spark = models4sparks[modelName][otherSparkId];
          debug('broadcast ' + modelName + ' deleted to spark ' + spark.id);
          spark.write(delData);
        });
      });

      debug('Setup ' + modelName + ' deletedAll event');
      app.models[modelName].on('deletedAll', function(where) {
        var delData = {
          type: 'model:deletedAll',
          model: modelName,
          where: where
        };
        debug(modelName + ' deletedAll', delData);

        // boradcast to all sparks
        Object.keys(models4sparks[modelName]).forEach(function(otherSparkId) {
          // can/should we omit the broadcast to the spark who
          // deleted the models?
          var spark = models4sparks[modelName][otherSparkId];
          debug('broadcast ' + modelName + ' deletedAll to spark ' + spark.id);
          spark.write(delData);
        });
      });

      //setTimeout(function() {
      //  console.log('DELETE ALL where color = black');
      //  app.models.Car.deleteAll({color: 'black'});
      //},3000);
    }

    // register spark updates for this model
    if(!models4sparks[modelName][spark.id]) {
      models4sparks[modelName][spark.id] = spark;

      // remove spark from registry on disconnect
      spark.on('end', function() {
        debug('spark disconnected, remove from ' + modelName);
        delete models4sparks[modelName][spark.id];
      });
    }
  
    next();
  });

};