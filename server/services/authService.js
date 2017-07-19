var _ = require("lodash");
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var encryptService = require('services/encryptionService');
var sql = require('services/sqlService');

var jwtOptions = {}
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';

var temp;
exports.auth = function( req, res, next, cb ) {
  console.log("Auth service called");
// console.log("header"+req.header);
  var token = req.body.token || req.query.token || req.headers.authentication;
  //console.log("req.headers" + JSON.stringify(req.headers));
  //console.log("token fetched " + token);

  // var temp=1;
  if (token) {

    jwt.verify(token, jwtOptions.secretOrKey, function(err, decoded) {

      if (err) {
        console.log("a");
        // return 0;
        cb(0);
      }
      else {
        console.log("b");
        req.decoded = decoded;
        var whereObj = {
          id: req.decoded.id
        }
        sql.findOne(sql.users, whereObj, function(obj) {
          if (!(obj.data.id)) {
            console.log("c");
            cb(0);
            temp++;

          }
          else {
            console.log("d");
            cb(1);
            temp++;
          }
        });
      }
    });
  }
  else {
    console.log("e");
    temp++;

  //  return 0
  }
  return temp;
}
// };
