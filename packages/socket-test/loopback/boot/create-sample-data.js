//var importer = require('../sample-data/import');

module.exports = function(app) {
  if (app.dataSources.db.name !== 'Memory') return;

  app.models.Car.create({
    name: 'My private car',
    year: 2014,
    make: "Skoda",
    model: "Octavia III",
    color: 'black'
  }, function(err, data) {
    console.log('Example Car created with ID:%s', data.id);
  });

  app.models.Car.create({
    name: 'Company car',
    year: 2014,
    make: "VW",
    model: "Multivan",
    color: 'red'
  }, function(err, data) {
    console.log('Example Car created with ID:%s', data.id);
  });

  app.models.Car.create({
    name: 'Funcar',
    year: 2011,
    make: "Dacia",
    model: "Logan",
    color: 'blue'
  }, function(err, data) {
    console.log('Example Car created with ID:%s', data.id);
  });

};

