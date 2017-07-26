"use strict";

const winston = require('winston');

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      'timestamp': function() {
        let offset = 5.5; // IST
        return new Date(new Date().getTime() + offset * 3600 * 1000).toUTCString().replace(/ GMT$/, "");
      },
      'level': process.env.LOG_LEVEL || 'debug'
    })
  ]
});

module.exports = logger;
