var events      = require('events')
  , http        = require('http')
  , querystring = require('querystring')
  , url         = require('url')
  , util        = require('util')
  ;

var DEFAULT_CONFIG = { app_key          : ''
                     , user_credentials : ''
                     };

var DEFAULT_LOGGER = { error   : function(msg, props) { console.log(msg); console.trace(props.exception); }
                     , warning : function(msg, props) { console.log(msg); if (props) console.log(props);  }
                     , notice  : function(msg, props) { console.log(msg); if (props) console.log(props);  }
                     , info    : function(msg, props) { console.log(msg); if (props) console.log(props);  }
                     };

var Koubachi = function() {
    this.devices = null;
    this.config = DEFAULT_CONFIG;
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

  if (!callback) callback = function(err, msg) { if (err) self.logger.error(err.message); else self.logger.info(msg); };

  options = url.parse('http://api.koubachi.com/' + path + '?' + querystring.stringify(self.config));
  options.method = (!!body) ? 'PUT' : 'GET';
  options.headers = { Accept: 'application/json' };
  http.request(options, function(response) {
    var content = '';

    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      content += chunk.toString();
    }).on('end', function() {
      callback(null, JSON.parse(content));
    }).on('close', function() {
    self.logger.error('koubachi', { event: 'http', diagnostic: 'premature EOF' });
    });
  }).on('error', function(err) {
    self.logger.error('koubachi', { event: 'http', diagnostic: 'get', exception: err });
  }).end(body);

  return this;
};

exports.Koubachi = Koubachi;
