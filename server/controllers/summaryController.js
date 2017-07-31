var sql = require('services/sqlService');
const apiService = require('services/apiService'),
  apiConfig = require('config/apiConfig');
// var encryptService = require('services/encryptionService');
// var authenticate = require('services/authService');
var authenticate = require('services/authService');


module.exports = function(app, passport) {

  //Show summary of courses, users and videos
  app.get('/trootorials-v1/api/all-summary/?', allSummaryHandler);
}

function allSummaryHandler(req, res, next) {
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {

      var object = [];
      sql.count(sql.courses, 'id', function(obj) {
        if (!obj) {
          object.push({
            courses: 0
          });
        } else {
          object.push({
            courses: obj.data.rows.length
          });
          //console.log(object);
        }
      });

      sql.count(sql.video, 'id', function(obj) {
        if (!obj) {
          object.push({
            videos: 0
          });
        } else {
          object.push({
            videos: obj.data.rows.length
          });
          //console.log(object);
        }
      });

      sql.count(sql.users, 'id', function(obj) {
        if (!obj) {
          object.push({
            users: 0
          });
          res.send(object);
        } else {
          object.push({
            users: obj.data.rows.length
          });
          res.send(object);
        }
      });
    } else {
      res.send({
        error: 0
      });
    }
  })
}
