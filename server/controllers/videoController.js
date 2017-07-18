const apiService = require('services/apiService'),
  sql = require('services/sqlService'),
  apiConfig = require('config/apiConfig');

module.exports = function(app, passport) {
  //Show all users
  app.get('/api/allvideos', allVideosHandler);

  //Get Update
  app.get('/api/getvideo/:id', particularVideoHandler);

  //Update post
  app.post('/api/videoUpdate/:id', VideoUpdateHandler);

  //POST Insert
  app.post('/api/addvideo', addVideoHandler);

  //Delete
  app.post('/api/videoDelete/:id', VideoDeleteHandler);
};


function addVideoHandler(req, res) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    duration: req.body.duration,
    file: req.body.file,
    uploadedat: req.body.uploadedat,
    ispublic: req.body.ispublic

  }
  if (!(data.title && data.description && data.author && data.duration && data.file && data.uploaded && data.ispublic)) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });

  } else {
    var whereObj = {
      id: req.body.title
    }
    sql.findOne(sql.video, whereObj, function(obj) {

      if (obj.data.title) {
        res.send({
          error: 'true',
          reason: 'Video already exists'
        })

      } else {
        sql.insert(sql.video, data, function(obj) {
          res.send({
            error: false,
            response: "Video created successfully"
          });
        })
      }
    })
  }
}



function allVideosHandler(req, res, next) {
  sql.findAll(sql.video, {}, function(obj) {
    console.log(obj);
    if (!obj.data) {
      res.send({
        error: true,
        reason: "No data found"
      });
    } else {
      res.send(obj);
    }
  });
}

function particularVideoHandler(req, res) {
  var whereObj = {
    id: req.params.id
  }
  if (!req.params.id) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });
  } else {
    sql.findOne(sql.video, whereObj, function(obj) {
      if (!(obj.data.id)) {
        res.send({
          error: true,
          response: "Video does not exist"
        })
      } else {
        res.send({
          error: false,
          response: obj
        });
      }
    });

  }
}

function VideoUpdateHandler(req, res, next) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    duration: req.body.duration,
    file: req.body.file,
    uploadedat: req.body.uploadedat,
    ispublic: req.body.ispublic
  }

  var whereobj = {
    id: req.params.id
  }

  if (!(data.title && data.description && data.author && data.file && data.uploadedat && data.ispublic))
    res.send({
      error: true,
      reason: "All fields not filled"
    });
  else {
    sql.update(sql.video, data, whereObj, function(obj) {
      res.send({
        error: false,
        response: "Updated successfully"
      });
    });
  }
}

function VideoDeleteHandler(req, res, next) {
  var whereobj = {
    id: req.params.id
  }

  sql.delete(sql.video, whereobj, function response(obj) {
    if (obj.data.id)
      res.send({
        error: false,
        response: "video deleted successfully!!"
      });
    else {
      res.send({
        error: true,
        reason: "video does not exist"
      })
    }

  });
}
