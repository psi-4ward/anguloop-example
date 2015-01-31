module.exports = function(Car) {

  // example remote method
  Car.prototype.refuel = function(amount, cb) {
      this.fuel = amount;
      this.save(function(err) {
        if(err) return cb(err);
        cb(null, amount);
      });
  };
  Car.remoteMethod('refuel', {
    accepts: [
      {arg: 'amount', type: 'number', required: true, http: {source: 'body'}}
    ],
    isStatic: false,
    http: {
      verb: 'put',
      path: '/refuel'
    },
    accessType: 'WRITE',
    description: 'Test remote method',
    returns: {arg: 'fuellevel', type: 'float'}
  });

  // example static remote method
  Car.random = function(cb) {
    cb(null, Math.random());
  };
  Car.remoteMethod('random', {
    http: {
      verb: 'get',
      path: '/random'
    },
    accessType: 'READ',
    description: 'Fetch a random number',
    returns: {arg: 'number', type: 'number'}
  });

};
