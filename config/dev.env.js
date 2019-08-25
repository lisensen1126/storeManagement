'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://panel.dev.chedianai.com/v1"',
  Enterprise_ID: '"abc123"',
  LOGIN_PATH: '"/#/login"',
})
