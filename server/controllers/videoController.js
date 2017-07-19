function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxx.mp4'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


const apiService = require('services/apiService'),
  sql = require('services/sqlService'),
  apiConfig = require('config/apiConfig');

module.exports = function(app, passport) {
  //Show all users
  app.get('/api/all-videos', allVideosHandler);

  //Get Update
  app.get('/api/get-video/:id', particularVideoHandler);

  //Update post
  app.post('/api/edit-video/:id', videoUpdateHandler);

  //POST Insert
  app.post('/api/add-video', addVideoHandler);

  //Delete
  app.post('/api/delete-video/:id', videoDeleteHandler);
};


function addVideoHandler(req, res) {
  var filename = req.body.file,
  filename=filename.replace(filename.substring(filename.lastIndexOf('/')+1),""),
  uuid = generateUUID();
  filename = filename+uuid;

  var data = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    duration: req.body.duration,
    file: filename,
    ispublic: req.body.ispublic
  }

  if (!(data.title && data.description && data.author && data.duration && data.file && data.ispublic)) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });

  } else {
    var whereObj = {
      title: req.body.title
    }
    sql.findOne(sql.video, whereObj, function(obj) {

      if (obj.data.id) {
        res.send({
          error: 'true',
          reason: 'Video already exists'
        })
      } else {
        sql.insert(sql.video, data, function(obj) {
          res.send({
            error: false,
            response: "Video created successfully"
          }
      );
      //console.log(obj);
        })
      }
    })
  }
}



function allVideosHandler(req, res, next) {
  sql.findAll(sql.video, {}, function(obj) {
    //console.log(obj);
    if(obj.error == true || obj.data.length == 0)
    res.send({
    error: true,
    reason: "No video found!!"
  });
    else if(!obj.data) {
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

function videoUpdateHandler(req, res, next) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    duration: req.body.duration,
    file: req.body.file,
    //uploadedat: req.body.uploadedat,
    ispublic: req.body.ispublic
  }

  var whereObj = {
    id: req.params.id
  }

  if (!(data.title && data.description && data.author && data.file && data.ispublic)){
    res.send({
      error: true,
      reason: "All fields not filled"
    });
  }
  else {
    sql.findOne(sql.video, whereObj, function(obj) {
    if (!(obj.data.id)) {
      res.send({
        error: true,
        response: "Video does not exist"
      })
    }
  else {
    sql.update(sql.video, data, whereObj, function(obj) {
      res.send({
        error: false,
        response: "Updated successfully"
      });
    });
  }
});
}
}

function videoDeleteHandler(req, res, next) {
  var whereobj = {
    id: req.params.id
  }

  sql.findOne(sql.video, whereobj, function(obj) {
  if (!(obj.data.id)) {
    res.send({
      error: true,
      response: "Video does not exist"
    })
  }
  else{
  sql.delete(sql.video, whereobj, function response(obj) {
      res.send({
        error: false,
        response: "Video deleted successfully!!"
      });
      })
}
})
}
