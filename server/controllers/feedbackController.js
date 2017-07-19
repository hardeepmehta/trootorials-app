const apiService = require('services/apiService'),
  sql = require('services/sqlService'),
  apiConfig = require('config/apiConfig');

module.exports = function(app, passport) {
// Get feedback
app.get('/api/get-feedback/:id', getFeedbackHandler);
// Add feedback
app.post('/api/add-feedback', addFeedbackHandler);
};


function getFeedbackHandler(req, res, next) {
  var data = {
    videoid: req.body.videoid,
    loginid: req.body.loginid,
    feedback: req.body.feedback
  }
  var whereobj = {
    id: req.params.id
  }

  sql.findAll(sql.feedback, whereobj, function validate(obj){
    if(obj.error == true || obj.data.length == 0)
    res.send({
    error: true,
    reason: "No data found!!"
  });
    else if(!obj.data)
    res.send({
    error: true,
    reason: "No feedback found"
  });
  else {
    res.send(obj);
  }

  });
}

function addFeedbackHandler(req, res, next) {
  var data = {
    //videoid: req.body.videoid,
    //loginid: req.body.loginid,
    feedback: req.body.feedback
    }

    if(!(data.feedback)) {
      res.send({
        error: true,
        reason: "All fields not filled!!"
      });

    }
    else {
      var whereObj = {
        feedback: req.body.feedback
      }
      sql.findOne(sql.feedback , whereObj , function(obj){

        if(obj.data.id){
          res.send({
            error : 'true',
            reason : 'feedback already exists!!'
          })

        }
        else {
          sql.insert(sql.feedback , data ,function(obj){
            res.send({
              error: false,
              response: "Feedback successfully sent"
            });
          })
      }
    })
  }
}
