var _ = require("lodash");
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var encryptService = require('services/encryptionService');
var sql = require('services/sqlService');

var jwtOptions = {}
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'Troofal';

var temp;
exports.auth = function( req, res, cb ) {
  // console.log("Auth service called");
// console.log("header"+req.header);
  var token = req.body.token || req.query.token || req.headers.authentication ||req.params.token;
  //console.log("req.headers" + JSON.stringify(req.headers));
  console.log("token fetched " + token);

  if (token) {
    jwt.verify(token, jwtOptions.secretOrKey, function(err, decoded) {
      if (err) {
        cb(0,null);
      }
      else {
        req.decoded = decoded;
        var whereObj = {
          id: req.decoded.id
        }
        sql.findOne(sql.users, whereObj, function(obj) {
          if (!(obj.data.id)) {
            cb(0,null);
          }
          else {
            cb(1,req.decoded.id);
          }
        });
      }
    });
  }
  else {
    cb(0,null);
  }
}
// };
