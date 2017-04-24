'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('liquidBind', function() {
  setupTest('fastboot'/*, options */);

  it('renders', function() {
    return this.visit('/liquid-bind')
      .then(function(res) {
        let $ = res.jQuery;
        let response = res.response;

        expect(response.statusCode).to.equal(200);
        expect($('#liquid-bind').text().trim()).to.equal('liquid-bind');
      });
  });

});