/*
UI TESTS THAT SHOULD WORK BUT STILL DON'T

const Browser = require('zombie');

Browser.localhost('localhost', 8080);

describe('UI TESTS', function() {

  const browser = new Browser();

  before(function(done) {
    browser.visit('/', done);
  });

  describe('Smoke', function() {

    before(function() {
      browser
        .fill('#username', 'tiivi.taavi@budghetto.space')
        .fill('#password', 'tiivitaavi');
      return browser.pressButton('#submit');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see transactions page', function() {
      browser.assert.text('header > h1', 'Budghetto');
    });
  });

});
*/
