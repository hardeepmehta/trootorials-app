var sql = require('services/sqlService');
const apiService = require('services/apiService'),
apiConfig = require('config/apiConfig');
var encryptService = require('services/encryptionService');
var authenticate = require('services/authService');


module.exports = function(app) {
  //Add a new mapping
  app.post('/trootorials-v1/api/add-mapping', addMappingHandler);

  //Get
  app.get('/trootorials-v1/api/get-mapping/:id/?', particularMappingHandler);

  app.get('/trootorials-v1/api/videos/:courseId/?', courseMappingHandler);

  app.post('/trootorials-v1/api/deletecourse-mapping/:cid/?', deleteMappingHandler);

  app.post('/trootorials-v1/api/deletevideo-mapping/:vid/?', deleteMappingHandlerVideo);

  app.post('/trootorials-v1/api/edit-mapping/:vid/?', editMappingHandler);
}


function particularMappingHandler(req, res) {
      var whereObj = {
        videoid: req.params.id
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
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {
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
else {
  res.send({
    error: 0
  });
}
})
}

function courseMappingHandler( req, res ) {
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {
  sql.queryOutlets('select * from MapVideo join Video where MapVideo.courseid = '+ req.params.courseId +' AND Video.id = MapVideo.videoid;', function( response ) {
    res.send( response );
  })}
  else {
    res.send({
      error: 0
    });
  }
})
}
function deleteMappingHandler(req, res) {
  var whereObj ={
      courseid: req.params.cid
  }
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if(status) {
      sql.delete(sql.mapvideo, whereObj, function(obj) {
        res.send({
          error: false,
          response: "mapping deleted successfully!!"
        });
      })
    }
    else {
      res.send({
        error: 0
      });

    }
  })
}
function deleteMappingHandlerVideo(req, res) {
  var whereObj ={
      videoid: req.params.vid
  }
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if(status) {
      sql.delete(sql.mapvideo, whereObj, function(obj) {
        res.send({
          error: false,
          response: "mapping deleted successfully!!"
        });
      })
    }
    else {
      res.send({
        error: 0
      });

    }
  })
}
function editMappingHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    if(status) {
      var whereObj ={
          videoid: req.params.vid
      }
      var newdata = {
        courseid: req.body.courseid,
        videoid: req.params.vid
      }
      if (!req.params.vid) {
        res.send({
          error: true,
          reason: "Insufficient parameters"
        });
      }
      sql.update(sql.mapvideo, newdata, whereObj, function(obj) {
        //console.log(whereObj);
        res.send({
          error: false,
          response: "Updated successfully"
        });
      });
    }
    else {
        res.send({
          error: 0
        });
      }

  })
}
