var piwik = (function() {
  var that = {
    url_for: function(options) {
      var settings = {
        install: localStorage.install,
        format: 'json',
        token_auth: localStorage.token,
        idSite: localStorage.site,
        period: localStorage.period || 'day',
        date: localStorage.date || 'last10',
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

    get: function(method, cache_selector, callback) {
      if ($.isFunction(cache_selector) && !callback) {
        callback = cache_selector;
        cache_selector = null;
      }
      var url = piwik.url_for({method: method});
      if ($(cache_selector).data('showing') === url) { return; }
      $.getJSON(url, function(json) {
        callback(json);
        if ($(cache_selector).length === 1) {
          $(cache_selector).data('showing', url);
        }
      });
    }
  };

  return that;
}());