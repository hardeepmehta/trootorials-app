var sql = require('services/sqlService');
const apiService = require('services/apiService'),
  apiConfig = require('config/apiConfig');
var encryptService = require('services/encryptionService');
//var authenticate = require('services/authService');


module.exports = function(app) {

  //Add a new mapping
  app.post('/api/add-mapping', addMappingHandler);

  //Get
  app.get('/api/get-mapping/:id', particularMappingHandler);

}

/*function allUsersHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {
      sql.findAll(sql.users, {}, function(obj) {
        ////console.log(obj);
        if (obj.error == true || obj.data.length == 0) {
          res.send({
            error: true,
            reason: "No data found"
          });
        } else if (!obj.data)
          res.send({
            error: true,
            reason: "No data found"
          });

        else {
          res.send(obj);
        }
      });
    } else {
      res.send({
        error: 0
      });
    }
  })
}
*/
function particularMappingHandler(req, res) {

    //console.log("status" + status);

      var whereObj = {
        courseid: req.params.id
      }
      if (!req.params.id) {
        res.send({
          error: true,
          reason: "Insufficient parameters"
        });
      } else {
        sql.findAll(sql.mapvideo, whereObj, function(obj) {
          // if (!(obj.data.id)) {
          //   res.send({
          //     error: true,
          //     response: "mapping does not exist"
          //   })
          // } else {
            res.send({
              error: false,
              response: obj
            });
          //}
        });
      }
}

function addMappingHandler(req, res) {

    //console.log("status" + status);

      var data = {
        courseid: req.body.courseid,
        videoid: req.body.videoid
      }
      if (!(data.courseid)) {
        res.send({
          error: true,
          reason: "Insufficient parameters"
        });
      } else {
        sql.insert(sql.mapvideo, data,function(obj){
          res.send({
            error: false,
            response: "Mapping created successfully",
            data: obj
          });

        })
      }


}
