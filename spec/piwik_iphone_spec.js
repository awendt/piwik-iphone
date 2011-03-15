require("piwik_iphone.js");

Screw.Unit(function() {
  describe("Piwik on iPhone", function() {
    describe("routing", function() {
      it("uses defaults", function() {
        url = piwik_iphone.url_for();
        expect(url).to(match, /\/\?module=API/);
        expect(url).to(match, /\/\?.*format=json/);
        expect(url).to(match, /\/\?.*jsoncallback=\?$/);
      });

      it("turns given hash into URL params", function() {
        url = piwik_iphone.url_for({some: 'parameter'});
        expect(url).to(match, /\/\?.*some=parameter/);
      });
    });

    describe("getting data", function() {
      var fetches_from;
      var success_fn;

      before(function() {
        mock(jQuery).must_receive("getJSON").and_execute(function(url, callback) {
          fetches_from = url;
          success_fn = callback;
        });
      });

      it("uses calls jQuery.getJSON with the correct URL", function() {
        mock(piwik_iphone).must_receive("url_for").with_arguments(
            {method: "Goals.getConversionRate"}).and_return("/some/url");

        piwik_iphone.get("Goals.getConversionRate");
        expect(fetches_from).to(be, "/some/url");
      });

      it("passes the callback to jQuery.getJSON", function() {
        var invokations = 0;
        var do_something = function() {
          invokations += 1;
        };
        piwik_iphone.get("Goals.getConversionRate", do_something);
        expect(invokations).to(be, 0);
        success_fn();
        expect(invokations).to(be, 1);
      });
    });
  });
});
