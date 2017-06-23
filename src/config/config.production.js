'use strict'

let config = require('./config.default')

config.env = 'production'
config.host = 'https://rest.emmanuelbeziat.com'
config.port = '3002'

module.exports = config