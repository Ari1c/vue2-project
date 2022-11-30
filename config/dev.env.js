'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API: '"/biz-admin"',
  COPY_RIGHT: '"Copyright © 2018-2021 xxx All Rights Reserved."'
})
