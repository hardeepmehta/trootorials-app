const apiService = require('services/apiService'),
  sql = require('services/sqlService'),
  apiConfig = require('config/apiConfig');

module.exports = function(app, passport) {
  // Add course
  app.post('/api/add-course', addCourseHandler); //checked

  // Get All Courses
  app.get('/api/all-courses', getCourseHandler); //checked

  //Update post
  app.post('/api/edit-course/:id', CourseUpdateHandler);  //checked

  //get Update
  app.get('/api/get-course/:id', getCourseUpdateHandler);  //checked

  //Delete
  app.post('/api/delete-course/:id', CourseDeleteHandler);
};


function getCourseHandler(req, res, next) {
  sql.findAll(sql.courses,{}, function(obj) {
    if (obj.error == true || obj.data.length == 0)
      res.send({
        error: true,
        reason: "No data found"
      });
    else if (!obj.data)
      res.send({
        error: true,
        reason: "No data found"
      });
    else {
      res.send(obj);
    }
  });
}


function addCourseHandler(req, res, next) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration
  }


  if (!(data.title && data.description && data.duration)) {
    res.send({
      error: true,
      reason: "All fields not filled!!"
    });

  } else {
    var whereObj = {
      title: req.body.title
    }
    sql.findOne(sql.courses, whereObj, function(obj) {

      if (obj.data.id) {
        res.send({
          error: 'true',
          reason: 'course already exists!!'
        })

      } else {
        sql.insert(sql.courses, data, function(obj) {
          res.send({
            error: false,
            response: "course successfully added"
          });
        })

      }
    })
  }
}

function CourseUpdateHandler(req, res, next) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration
  }

  var whereObj = {
    id: req.params.id
  }

  if (!req.params.id) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });
  }
  if (!(data.title && data.description && data.duration)){
    res.send({
      error: true,
      reason: "All fields not filled"
    });
  }
  else
    {
      sql.findOne(sql.courses, whereObj, function(obj) {
      if (!(obj.data.id)) {
        res.send({
          error: true,
          response: "Course does not exist"
        })
      }
      else {
        sql.update(sql.courses, data, whereObj, function(obj) {
          res.send({
            error: false,
            response: "Updated successfully"
          });
        });
      }

    });
    }
  }


function CourseDeleteHandler(req, res, next) {
  var whereobj = {
    id: req.params.id
  }
  sql.findOne(sql.courses, whereobj, function(obj) {
  if (!(obj.data.id)) {
    res.send({
      error: true,
      response: "Course does not exist"
    })
  }
  else{
  sql.delete(sql.courses, whereobj, function(obj) {
      res.send({
        error: false,
        response: "Course deleted successfully!!"
      });
      })
}
})
}

function getCourseUpdateHandler(req, res, next) {
  var whereObj = {
    id: req.params.id
  }
  //else {
  if (!req.params.id) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });

  }
  else{
    sql.findOne(sql.courses, whereObj, function(obj) {
    if (!(obj.data.id)) {
      res.send({
        error: true,
        response: "Course does not exist"
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
