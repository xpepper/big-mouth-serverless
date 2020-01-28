'use strict'

const co = require("co")
const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const Mustache = require("mustache")
const http = require("superagent-promise")(require("superagent"), Promise)
const aws4 = require("aws4")
const URL = require("url")
const awscred = Promise.promisifyAll(require('awscred'))

const awsRegion = process.env.AWS_REGION
const cognitoUserPoolId = process.env.cognito_user_pool_id
const cognitoClientId = process.env.cognito_client_id

const restaurantsApiRoot = process.env.restaurants_api
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

var html

function* loadHtml() {
  if (!html) {
    html = yield fs.readFileAsync('static/index.html', 'UTF-8')
  }

  return html
}

function* getRestaurants() {
  let url = URL.parse(restaurantsApiRoot)
  let opts = {
    host: url.hostname,
    path: url.pathname
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    let awsCredentials = (yield awscred.loadAsync()).credentials

    process.env.AWS_ACCESS_KEY_ID = awsCredentials.accessKeyId
    process.env.AWS_SECRET_ACCESS_KEY = awsCredentials.secretAccessKey
  }

  aws4.sign(opts)

  let httpRequest = http
    .get(restaurantsApiRoot)
    .set('Host', opts.headers['Host'])
    .set('X-Amz-Date', opts.headers['X-Amz-Date'])
    .set('Authorization', opts.headers['Authorization'])

  if (opts.headers['X-Amz-Security-Token']) {
    httpRequest.set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token'])
  }

  return (yield httpRequest).body
}

module.exports.handler = co.wrap(function* (event, context, callback) {
  let template = yield loadHtml()
  let restaurants = yield getRestaurants()
  let dayOfWeek = days[new Date().getDay()]
  let view = {
    dayOfWeek,
    restaurants,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    searchUrl: `${restaurantsApiRoot}/search`
  }
  let html = Mustache.render(template, view)

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'content-type': 'text/html; charset=UTF-8'
    }
  }

  callback(null, response)
})
