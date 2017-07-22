const apiService = require('services/apiService'),
 apiConfig = require('config/apiConfig');
var _ = require("lodash");
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var encryptService = require('services/encryptionService');
var sql = require('services/sqlService');
var localstorage = require('node-localstorage')

// var blacklist = require('express-jwt-blacklist');
// var LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');       //Directory where token will be saved

var jwtOptions = {}
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'Troofal'

module.exports = function(app, passport) {
  // Login User
  app.post('/api/login', loginHandler);

  // Check if user is logged in
  app.get('/api/loggedin', isLoggedInHandler);

  // Logout
  app.get('/api/logout', logoutHandler)
};

function loginHandler(req, res, next) {
  console.log("req.body" + req.body);
 //  if (typeof localStorage === "undefined" || localStorage === null) {
 //
 // }

  var whereObj = {
    email: req.body.email
  }
  console.log("whereObj email" + whereObj.email);
  if (!req.body.email) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });
  } else {
    sql.findOne(sql.users, whereObj, function(obj) {
      if (!(obj.data.id)) {
        res.send({
          error: true,
          response: "User does not exist" + JSON.stringify(obj)
        })
      } else {
        if (obj.data.password == encryptService.encrypt(req.body.password)) {
          var payload = {
            id: obj.data.id
          };
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          res.json({
            message: "ok",
            token: token,
            level:obj.data.level
          });
        } else {
          res.status(401).json({
            message: "passwords did not match"
          });
        }
      }
    });
  }
}

function isLoggedInHandler(req, res, next) {
  var token = req.body.token || req.query.token || req.headers.authentication;

  // token = localStorage.getItem('token')
  // console.log(localStorage.getItem('token'));
  // console.log("token fetched " + localStorage.getItem('token'));
  if (token) {
    jwt.verify(token, jwtOptions.secretOrKey, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decoded;
        var whereObj = {
          id: req.decoded.id
        }
        sql.findOne(sql.users, whereObj, function(obj) {
          if (!(obj.data.id)) {
            res.send({
              error: true,
              response: "User does not exist"
            })
          } else {
            res.send({
              error: false,
              response: {
                id: obj.data.id,
                name: obj.data.name,
                password: obj.data.password,
                level: obj.data.level,
              }
            });
          }
        });
      }
    });
  }
  else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}

function logoutHandler(req, res, next) {
  var token = req.body.token || req.query.token || req.headers.authentication;
  console.log("token fetched " + token);
  //jwtOptions.secretOrKey = makeid();
  //token = 0;
  console.log(localStorage.removeItem('myFirstKey'));
  req.logout();
  // res.redirect('/');
}
