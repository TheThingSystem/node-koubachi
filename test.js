var Koubachi = require('./koubachi')
  , koubachi = new Koubachi.Koubachi()
  ;

koubachi.on('error', function(err) {
  console.log('koubachi error'); console.error (err);
}).setConfig('...', '...'
).getDevices(function(err, results) {
  var i;

  if (err) return console.log('getDevices: ' + err.message);

  for (i = 0; i < results.length; i++) {
    console.log('device #' + i);
    console.log(results[i]);
  }
}).getPlants(function(err, results) {
  var i, id;

  if (err) return console.log('getPlants: ' + err.message);

  var pending = function(id) {
    return function(err, results) {
      var i;

      if (err) return console.log('getTasks: ' + err.message);

      console.log('plant #' + id + ' tasks');
      for (i = 0; i < results.length; i++) console.log(results[i].plant_care_advice);
    };
  };
  var reading = function(id) {
    return function(err, results) {
      var i;

      if (err) return console.log('getReadings: ' + err.message);

      console.log('plant #' + id + ' readings');
      for (i = 0; i < results.sensors.length; i++) console.log('sensor type: ' + results.sensors[i].sensor.sensor_type_id);
    };
  };

  for (i = 0; i < results.length; i++) {
    id = results[i].plant.id;

    console.log('plant #' + id);
    console.log(results[i]);
    koubachi.getTasks(id, pending(id));
    koubachi.getReadings(id, reading(id));
  }
});
