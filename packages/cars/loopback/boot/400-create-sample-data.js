//var importer = require('../sample-car/import');

module.exports = function(app) {
  if (app.dataSources.db.name !== 'Memory') return;

  app.models.Car.create({
    name: 'My private car',
    year: 2014,
    make: "Skoda",
    model: "Octavia III",
    color: 'black'
  }, function(err, car) {
    if(err) return console.log(err.message || err);
    console.log('Example Car created with ID:%s', car.id);

    car.drivers.create({
      name: "Peter",
      age: 52
    }, function(err, driver) {
      if(err) return console.log(err.message || err);
      console.log('Driver with ID:%s for Car ID:%s created', driver.id, car.id);
    });

    car.drivers.create({
      name: "Marie",
      age: 22
    }, function(err, driver) {
      if(err) return console.log(err.message || err);
      console.log('Driver with ID:%s for Car ID:%s created', driver.id, car.id);
    });

  });

  app.models.Car.create({
    name: 'Company car',
    year: 2014,
    make: "VW",
    model: "Multivan",
    color: 'red'
  }, function(err, car) {
    if(err) return console.log(err.message || err);
    console.log('Example Car created with ID:%s', car.id);
  });

  app.models.Car.create({
    name: 'Funcar',
    year: 2011,
    make: "Dacia",
    model: "Logan",
    color: 'blue'
  }, function(err, car) {
    if(err) return console.log(err.message || err);
    console.log('Example Car created with ID:%s', car.id);
  });

};

