'use strict'

const co = require("co")
const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const Mustache = require("mustache")
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

var html

function* getRestaurants() {
  return []
}

function* loadHtml() {
  if (!html)  {
    html = yield fs.readFileAsync('static/index.html', 'UTF-8')
  }

  return html
}

module.exports.handler = co.wrap(function* (event, context, callback) {
  let template = yield loadHtml()
  let restaurants = yield getRestaurants()
  let dayOfWeek = days[new Date().getDay()]
  let html = Mustache.render(template, { dayOfWeek, restaurants })

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  }

  callback(null, response)
})
