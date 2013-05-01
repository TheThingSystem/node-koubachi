node-koubachi
=============

A node.js module to interface with the [Koubachi Wi-Fi Plant Sensor](http://koubachi.com)

First things first, go to [Koubachi labs](http://labs.koubachi.com) and sign up for access.
You will get back two values, _app_key_ and _user_credentials_ which are tied to your account.


Install
-------

    npm install node-koubachi


API
---

Please consult the [koubachi](http://koubachi.com) API [documentation](http://labs.koubachi.com/documentations?locale=en)

### Load module

    var Koubachi = require('node-koubachi')
      , koubachi = new Koubachi.Koubachi()
      ;
    
### Login to cloud

    koubachi.on('error', function(err) {
      ...
    }).setConfig('$APP_KEY', '$USER_CREDENTIALS');

### Get device information

    koubachi.getDevices(function(err, results) {
      var devices, i;

      if (err) return console.log('getDevices: ' + err.message);

      devices = {};
      for (i = 0; i < results.length; i++) {       
        devices[results[i].mac_address] = results[i];

        // inspect results[i]
      }
    }

#### Get plant information

    koubachi.getPlants(function(err, results) {
      var i, plants;

      if (err) return console.log('getDevices: ' + err.message);

      plants = {};
      for (i = 0; i < results.length; i++) {       
        plants[results[i].id] = results[i];

        // inspect results[i]
      }
    }


### Get advice for a particular plant

    koubachi.getTasks(plantID, function(err, results) {
      var i;

      if (err) return console.log('getTasks: ' + err.message);

      for (i = 0; i < results.length; i++) {
        // inspect results[i].plant_care_advice
      }

    });


### Get sensor readings for a particular plant

    koubachi.getReadings(plantID, function(err, results) {
      var i;

      if (err) return console.log('getTasks: ' + err.message);

      for (i = 0; i < results.sensors.length; i++) {
        // inspect results.sensors[i].sensor
      }

    });


Finally
-------

Enjoy!


License
-------

MIT. Freely have you received, freely give.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
