'use strict'

const co = require('co')
const Promise = require('bluebird')
const awscred = Promise.promisifyAll(require('awscred'))

let initialized = false

let init = co.wrap(function* () {
  if (initialized) {
    return
  }

  process.env.restaurants_api = "https://ehjijmyk9g.execute-api.eu-west-1.amazonaws.com/dev/restaurants"
  process.env.restaurants_table = "restaurants_ganzodigomma"
  process.env.AWS_REGION = "eu-west-1"
  process.env.cognito_client_id = "test_cognito_client_id" 
  process.env.cognito_user_pool_id = "test_cognito_user_pool_id"

  let awsCredentials = (yield awscred.loadAsync()).credentials

  process.env.AWS_ACCESS_KEY_ID = awsCredentials.accessKeyId
  process.env.AWS_SECRET_ACCESS_KEY = awsCredentials.secretAccessKey

  console.log("AWS credentials loaded")

  initialized = true
})

module.exports.init = init
