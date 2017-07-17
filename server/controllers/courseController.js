
  const apiService = require('services/apiService'),
    sql = require('services/sqlService'),
    apiConfig = require('config/apiConfig');

module.exports = function(app, passport) {
  // Get All Courses
  app.get('/api/course', getCourseHandler);

  // Add course
  app.post('/api/addCourse', addCourseHandler);

  //Update post
  app.post('/api/courseUpdate/:id', CourseUpdateHandler);

  //get Update
  app.get('/api/courseUpdateGet/:id', getCourseUpdateHandler);

  //Delete
  app.post('/api/courseDelete/:id', CourseDeleteHandler);
};

function getCourseHandler(req, res, next) {
  sql.findAll(sql.courses, {}, function validate(obj) {
    console.log(obj);
    if (!obj.data)
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

  var whereobj = {
    id: req.params.id
  }

  if (!(data.title && data.description && data.duration))
    res.send({
      error: true,
      reason: "All fields not filled"
    });
  else {
    sql.update(sql.courses, data, whereObj, function(obj) {
      res.send({
        error: false,
        response: "Updated successfully"
      });
    });
  }
}

function CourseDeleteHandler(req, res, next) {
  var whereobj = {
    id: req.params.id
  }

  sql.delete(sql.courses, whereobj, function response(obj) {
    if (obj.data.id)
      res.send({
        error: false,
        response: "Course deleted successfully!!"
      });
    else {
      res.send({
        error: true,
        reason: "Course does not exist"
      })
    }

  });
}


function getCourseUpdateHandler(req, res, next) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration
  }
  var whereobj = {
    id: req.params.id
  }

  if (!(data.title && data.description && data.duration))
    res.send({
      error: true,
      reason: "All fields not filled"
    });
  else {
    sql.update(sql.courses, data, whereObj, function(obj) {
      res.send({
        error: false,
        response: "Updated successfully"
      });
    });

  }
}
