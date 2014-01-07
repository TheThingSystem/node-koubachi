var events      = require('events')
  , http        = require('http')
  , querystring = require('querystring')
  , url         = require('url')
  , util        = require('util')
  ;

var DEFAULT_CONFIG = { app_key          : ''
                     , user_credentials : ''
                     };

var DEFAULT_LOGGER = { error   : function(msg, props) { console.log(msg); if (!!props) console.trace(props.exception); }
                     , warning : function(msg, props) { console.log(msg); if (!!props) console.log(props);             }
                     , notice  : function(msg, props) { console.log(msg); if (!!props) console.log(props);             }
                     , info    : function(msg, props) { console.log(msg); if (!!props) console.log(props);             }
                     , debug   : function(msg, props) { console.log(msg); if (!!props) console.log(props);             }
                     };

var Koubachi = function() {
  var k;

  if (!(this instanceof Koubachi)) return new Koubachi();

  this.devices = null;
  this.config = {};
  for (k in DEFAULT_CONFIG) if (DEFAULT_CONFIG.hasOwnProperty(k)) this.config[k] = DEFAULT_CONFIG[k];
  this.logger = DEFAULT_LOGGER;
};
util.inherits(Koubachi, events.EventEmitter);

Koubachi.prototype.setConfig = function(appKey, userCredentials) {
  this.config.app_key = appKey;
  this.config.user_credentials = userCredentials;

  return this;
};

Koubachi.prototype.getDevices = function(callback) {
  return this.invoke('v2/user/smart_devices', callback);
};

Koubachi.prototype.getPlants = function(callback) {
  return this.invoke('v2/plants', callback);
};

Koubachi.prototype.getTasks = function(plantID, callback) {
  return this.invoke('v2/plants/' + plantID + '/pending_tasks', callback);
};

Koubachi.prototype.getReadings = function(plantID, callback) {
  return this.invoke('v2/plants/' + plantID + '/readings', callback);
};

Koubachi.prototype.invoke = function(path, body, callback) {
  var options, self;

  self = this;

  if (typeof body === 'function') {
    callback = body;
    body = null;
  }

  if (!callback) callback = function(err, results) { if (err) self.logger.error(err.message); else self.logger.info(results); };

  options = url.parse('http://api.koubachi.com/' + path + '?' + querystring.stringify(self.config));
  options.method = (!!body) ? 'PUT' : 'GET';
  options.headers = { Accept: 'application/json' };
  http.request(options, function(response) {
    var content = '';

    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      content += chunk.toString();
    }).on('end', function() {
      var err, results;

      try { results = JSON.parse(content); } catch(ex) {
        self.logger.error('json', { exception: ex });
        return callback(ex, null);
      }

      if (!!results.single_access_token) {
        err = new Error(!!results.single_access_token[0] || results.single_access_token);
        self.logger.error('authentication', { exception: err });
        return callback(err, null);
      }

      callback(null, results);
    }).on('close', function() {
      self.logger.error('https', { exception: new Error('premature EOF') });
    });
  }).on('error', function(err) {
    self.logger.error('http', { exception: err });
  }).end(body);

  return this;
};

exports.Koubachi = Koubachi;
