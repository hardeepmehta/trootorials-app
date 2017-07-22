 var _ = require("lodash");
  var jwt = require('jsonwebtoken');
  var passportJWT = require("passport-jwt");
  var sql = require('services/sqlService');


var jwtOptions = {}
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';


var strategy = new passportJWT.Strategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  var user = sql.users[_.findIndex(sql.users, {
    id: jwt_payload.id
  })];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

module.exports = strategy;
