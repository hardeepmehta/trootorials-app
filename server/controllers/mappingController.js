var sql = require('services/sqlService');
const apiService = require('services/apiService'),
apiConfig = require('config/apiConfig');
var encryptService = require('services/encryptionService');


module.exports = function(app) {
  //Add a new mapping
  app.post('/api/add-mapping', addMappingHandler);

  //Get
  app.get('/api/get-mapping/:id', particularMappingHandler);
}


function particularMappingHandler(req, res) {
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
            res.send({
              error: false,
              response: obj
            });
        });
      }
}

function addMappingHandler(req, res) {
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
