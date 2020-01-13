'use strict'

const co = require("co")

let initialized = false

let init = co.wrap(function* () {
  if (initialized) {
    return
  }

  process.env.restaurants_api = "https://oo613s6jt2.execute-api.eu-west-1.amazonaws.com/dev/restaurants"
  process.env.restaurants_table = "restaurants_ganzodigomma"
  process.env.AWS_REGION = "eu-west-1"
  process.env.cognito_client_id = "test_cognito_client_id" 
  process.env.cognito_user_pool_id = "test_cognito_user_pool_id"

  initialized = true
})

module.exports.init = init
