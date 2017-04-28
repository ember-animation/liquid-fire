'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('liquidIf', function() {
  setupTest('fastboot'/*, options */);

  it('renders', function() {
    return this.visit('/liquid-if')
      .then(function(res) {
        let $ = res.jQuery;
        let response = res.response;

        expect(response.statusCode).to.equal(200);
        expect($('#liquid-if').text().trim()).to.equal('true');
      });
  });

});