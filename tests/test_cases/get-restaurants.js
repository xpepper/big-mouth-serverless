'use strict';

const co = require('co');
const expect = require('chai').expect;
const init = require('../steps/init').init;
const when = require('../steps/when');

describe(`When we invoke the GET /restaurants endpoint`, co.wrap(function* () {
  before(co.wrap(function* () {
    yield init();
  }));

  it(`Should return an array of 8 restaurants`, co.wrap(function* () {
    let response = yield when.we_invoke_get_restaurants();

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.have.lengthOf(8);

    for (let restaurant of response.body) {
      expect(restaurant).to.have.property('name');
      expect(restaurant).to.have.property('image');
    }
  }));
}));
