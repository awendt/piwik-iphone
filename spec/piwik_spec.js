require("piwik.js");

Screw.Unit(function() {
  describe("Piwik", function() {
    before(function() {
      localStorage.clear();
    });

    describe("routing", function() {
      it("uses defaults", function() {
        url = piwik.url_for();
        expect(url).to(match, /\/\?module=API/);
        expect(url).to(match, /\/\?.*format=json/);
        expect(url).to(match, /\/\?.*jsoncallback=\?$/);
      });

      it("turns given hash into URL params", function() {
        url = piwik.url_for({some: 'parameter'});
        expect(url).to(match, /\/\?.*some=parameter/);
      });

      describe("timespan", function() {
        it("uses defaults", function() {
          url = piwik.url_for();
          expect(url).to(match, /\/\?.*period=day/);
          expect(url).to(match, /\/\?.*date=last10/);
        });

        it("is configurable", function() {
          localStorage.period = 'month';
          localStorage.date = 'last11';
          url = piwik.url_for();
          expect(url).to(match, /\/\?.*period=month/);
          expect(url).to(match, /\/\?.*date=last11/);
        });
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
        mock(piwik).must_receive("url_for").with_arguments(
            {method: "Goals.getConversionRate"}).and_return("/some/url");

        piwik.get("Goals.getConversionRate");
        expect(fetches_from).to(be, "/some/url");
      });

      it("passes the callback to jQuery.getJSON", function() {
        var invokations = 0;
        var do_something = function() {
          invokations += 1;
        };
        piwik.get("Goals.getConversionRate", do_something);
        expect(invokations).to(be, 0);
        success_fn();
        expect(invokations).to(be, 1);
      });
    });
  });
});
