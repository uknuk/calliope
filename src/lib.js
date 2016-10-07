var $ = require('jquery'),
    moment = require('moment-timezone'),
    translate = require('./translate.js'),
    lib = exports;

lib.conf = {
  timezone: "Europe/Helsinki",
  locale: "sv"
}

require("moment/locale/sv");
// browserify needs to know locale
moment.locale(this.conf.locale);

lib.data = {};

lib.request = function(config) {
  if (!config.method)
    config.method = 'get';
  if (_.isUndefined(config.contentType)) {
    config.contentType = 'application/json';
    config.dataType = 'json';
  }

  config.url = '/api' + config.url;
  config.beforeSend = function(jqxhr, config) {
    jqxhr.requestURL = config.url;
  };
  return $.ajax(config).promise();
};

lib.get = function(url, caller) {
  caller.setState({loading: true});
  this.request({url: url})
      .done(function(resp) {
        if (resp.result == 'fail')
          caller.setError(resp.msg);
        else
          caller.getData(resp);
      })
      .fail(function(error) {
        caller.handleError(error);
      })
      .always(function() {
        caller.setState({loading: false});
      });
};

lib.save = function(url, method, data, caller) {
  caller.setState({saved: false});
  this.request({
    url: url,
    method: method,
    data: JSON.stringify(data)
  })
      .done(function(resp) {
        if (resp.result == 'ok') {
          if (!caller.state.saved)
            caller.onSaved(resp);
        }
        else
          caller.setError(resp.msg);
      })
      .fail(function(error) {
        caller.handleError(error);
      });
};

lib.showDate = function(date) {
  var ar = moment(date).format("LLL").split(" ");
  ar.splice(2,1);
  return ar.join(" ");
};

lib.setDate = function(date) {
  return moment.tz(date, this.conf.timezone).format();
};

lib.tr = function(phrase) {
  return translate[lib.conf.locale][phrase];
};
