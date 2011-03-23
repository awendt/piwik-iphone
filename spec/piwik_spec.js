require("piwik.js");

Screw.Unit(function() {
  use_fixture("piwik");

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
        mock(jQuery).should_receive("getJSON").and_execute(function(url, callback) {
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

      // Might want to call url_for with arbitrary params, see also $.isPlainObject()
      it("allows for a hash as first param to pass to url_for")

      describe("caching data", function() {
        it("stores the URL in 'data' of the element with the given selector", function() {
          mock(piwik).must_receive('url_for').and_return("/some/url");
          piwik.get("Goals.getConversionRate", "#some_element", mock_function());

          expect($("#some_element").data('showing')).to(be_undefined);
          success_fn();
          expect($("#some_element").data('showing')).to(be, '/some/url');
        });

        it("does not fetch again if 'data' matches current URL", function() {
          mock(jQuery).should_not_receive("getJSON");
          var do_something = mock_function();
          mock(piwik).must_receive('url_for').and_return('/already/accessed');
          $("#some_element").data('showing', '/already/accessed');
          piwik.get("Goals.getConversionRate", "#some_element", do_something);

          do_something.should_not_be_invoked();
        });
      });

      describe("loader overlay", function() {
        it("is shown before the AJAX call begins", function() {
          expect($("#some_element .loading").css("display")).to(be, "none");
          piwik.get("Goals.getConversionRate", "#some_element", mock_function());
          expect($("#some_element .loading").css("display")).to_not(be, "none");
        });

        it("is hidden after the AJAX call returns", function() {
          piwik.get("Goals.getConversionRate", "#some_element", mock_function());
          expect($("#some_element .loading").css("display")).to_not(be, "none");
          success_fn();
          expect($("#some_element .loading").css("display")).to(be, "none");
        });

        it("is not toggled at all when data is already available", function() {
          mock(piwik).must_receive('url_for').and_return('/already/accessed');
          $("#some_element").data('showing', '/already/accessed');

          expect($("#some_element .loading").css("display")).to(be, "none");
          piwik.get("Goals.getConversionRate", "#some_element", mock_function());
          expect($("#some_element .loading").css("display")).to(be, "none");
        });
      });
    });

    describe("converting dates", function() {
      it("should return a date with slashes so Safari does not choke", function() {
        var date = piwik.convert_date("2011-03-04");
        expect(date.toDateString()).to(be, "Fri Mar 04 2011");
      })

      it("should return a single parsable date for ranges", function() {
        var date = piwik.convert_date("2011-03-03 to 2011-03-09");
        expect(date.toDateString()).to(be, "Wed Mar 09 2011");
      })

      it("should return a single parsable date for month", function() {
        var date = piwik.convert_date("2011-03");
        expect(date.toDateString()).to(be, "Tue Mar 01 2011");
      })

      it("should return a single parsable date for year", function() {
        var date = piwik.convert_date("2011");
        expect(date.toDateString()).to(be, "Sat Jan 01 2011");
      })
    });
  });
});
