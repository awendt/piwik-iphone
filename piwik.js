var piwik = (function() {
  var that = {
    url_for: function(options) {
      var settings = {
        install: localStorage.install,
        format: 'json',
        token_auth: localStorage.token,
        idSite: localStorage.site,
      };
      $.extend(settings, options);
      var install = settings.install;
      delete settings.install;

      var query_elements = [];
      $.each(settings, function(key, value) {
        if (value) {
          query_elements.push(key+"="+value);
        }
      });
      query_elements.push("jsoncallback=?");
      return install+"/?module=API&" + query_elements.join("&");
    },

    get: function(method, callback) {
      $.getJSON(piwik.url_for({method: method}), callback);
    }
  };

  return that;
}());