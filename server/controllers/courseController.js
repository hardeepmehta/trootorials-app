
  const apiService = require('services/apiService'),
    sql = require('services/sqlService'),
    apiConfig = require('config/apiConfig');

module.exports = function(app, passport) {
  // Get All Courses
  app.get('/api/course', getCourseHandler);

 // Add course
  app.post('/api/addcourse', addCourseHandler);

  //Update post
  app.post('/api/courseupdate/:id', CourseUpdateHandler);

  //get Update
  app.get('/api/courseupdateget/:id', getCourseUpdateHandler);

  //Delete
  app.post('/api/coursedelete/:id', CourseDeleteHandler);
};

function getCourseHandler(req, res, next) {
    sql.findAll(sql.courses,1,function(obj){
          res.send(obj);
    });
}

function addCourseHandler(req, res, next) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration
    }

    sql.insert(sql.courses,data,function(obj){
          res.send(obj);
    });
}

function CourseUpdateHandler(req, res, next) {
  var newob = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration
    }

  var whereobj = {
    id: req.params.id
  }
    sql.update(sql.courses,newob, whereobj,function(obj){
          res.send(obj);
    });
}

function CourseDeleteHandler(req, res, next) {
  var whereobj = {
    id: req.params.id
  }
  sql.delete(sql.courses,whereobj,function(obj){
      res.send(obj);
  });
}


function getCourseUpdateHandler(req, res, next) {
  var whereobj = {
    id: req.params.id
  }
  sql.findOne(sql.courses,whereobj,function(obj){
      res.send(obj);
  })
}
