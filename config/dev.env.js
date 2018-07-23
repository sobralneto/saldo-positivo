'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_ROOT_API: '"http://localhost:53417"',
  apiKey: 'AIzaSyAZwhdf8WwvhGBq9dcpLHlmMXnqde4iHQY',
  CONFIG_FIREBASE: {
    apiKey: 'AIzaSyAZwhdf8WwvhGBq9dcpLHlmMXnqde4iHQY',
    authDomain: 'saldo-positivo.firebaseapp.com',
    databaseURL: 'https://saldo-positivo.firebaseio.com',
    projectId: 'saldo-positivo',
    storageBucket: 'saldo-positivo.appspot.com',
    messagingSenderId: '6047805400'
  }
})
