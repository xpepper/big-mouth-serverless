'use strict'

const co = require('co')
const expect = require('chai').expect
const when = require('../steps/when')
const init = require('../steps/init').init
const cheerio = require('cheerio')

describe(`When we invoke the GET / endpoint`, co.wrap(function* () {
  before(co.wrap(function* () {
    yield init()
  }))

  it(`Should return the index page with 8 restaurants`, co.wrap(function* () {
    let response = yield when.we_invoke_get_index()

    expect(response.statusCode).to.equal(200)
    expect(response.headers['content-type']).to.equal('text/html; charset=UTF-8')
    expect(response.body).to.not.be.null

    let $ = cheerio.load(response.body)
    let restaurants = $('.restaurant', '#restaurantsUl')
    expect(restaurants.length).to.equal(8)
  }))
}))
