'use strict'

const co = require('co')

let initialized = false

function* loadCredentials() {
  const Promise = require('bluebird')
  const awscred = Promise.promisifyAll(require('awscred'))
  if (!process.env.AWS_ACCESS_KEY_ID) {
    let awsCredentials = (yield awscred.loadAsync()).credentials

    process.env.AWS_ACCESS_KEY_ID = awsCredentials.accessKeyId
    process.env.AWS_SECRET_ACCESS_KEY = awsCredentials.secretAccessKey

    if (awsCredentials.sessionToken) {
      process.env.AWS_SESSION_TOKEN = awsCredentials.sessionToken
    }
  }
}

let init = co.wrap(function* () {
  if (initialized) {
    return
  }

  process.env.restaurants_api = "https://ehjijmyk9g.execute-api.eu-west-1.amazonaws.com/dev/restaurants"
  process.env.restaurants_table = "restaurants_ganzodigomma"
  process.env.AWS_REGION = "eu-west-1"
  process.env.cognito_client_id = "test_cognito_client_id" 
  process.env.cognito_user_pool_id = "eu-west-1_tdRNBHtxD"
  process.env.cognito_server_client_id = "7r175s1eoa9qmmiuni15rrfjkv"

  yield loadCredentials()
  initialized = true
})

module.exports.init = init
