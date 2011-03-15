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
  });
});
