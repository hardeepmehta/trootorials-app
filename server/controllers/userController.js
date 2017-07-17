var sql = require('services/sqlService');
const apiService = require('services/apiService'),
      apiConfig = require('config/apiConfig');
var encryptService = require('services/encryptionService');


module.exports = function( app, passport ) {

  //Show all users
  app.get('/api/allusers' , allUsersHandler);

  //Show a particular user
  app.get('/api/getuser/:id' , particularUserHandler);

  //Add a new user
  app.post('/api/adduser' , addUserHandler);

  //Delete a user
  app.post('/api/deleteuser/:id' , deleteHandler);

  //Update a user
  app.post('/api/updateuser/:id' , updateHandler);

}

function allUsersHandler(req , res, next){
  sql.findAll(sql.users , {} ,function(obj) {
    console.log(obj);
    if(!obj.data){
      res.send({
        error: true,
        reason: "No data found"
      });

    }
    else {
      res.send(obj);
    }

  } );

}

function particularUserHandler(req , res) {
  var whereObj = {
      id: req.params.id
    }
    if(!req.params.id){
      res.send({
        error: true,
        reason: "Insufficient parameters"
      });

    }
    else {
      sql.findOne(sql.users , whereObj ,function(obj){
        if(!(obj.data.id)){
          res.send({
            error: true,
            response: "User does not exist"
          })
        }
        else {
          res.send({
            error: false,
            response: obj
          });
        }
      });

    }
}

function addUserHandler(req , res) {
  var data = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    password: encryptService.encrypt(req.body.password),
    level: req.body.level,
    token: req.body.token

  }
  if(!(data.name && data.mobile && data.email && data.password && data.level && data.token)) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });

  }
  else {
    var whereObj = {
      email: req.body.email
    }
    sql.findOne(sql.users , whereObj , function(obj){

      if(obj.data.id){
        res.send({
          error : 'true',
          reason : 'User already exists'
        })

      }
      else {
        sql.insert(sql.users , data ,function(obj){
          res.send({
            error: false,
            response: "User created successfully"
          });
        })

    }
  })
}
}

function deleteHandler(req , res) {
  var whereObj = {
      id: req.params.id

  }
  sql.delete(sql.users , whereObj , function response(obj) {

    if(obj.error == false)
    res.send({
      error: false,
      response: "User deleted successfully"
    });
    else {
      res.send({
        error: true,
        reason: "User does not exist"
      })
    }

  });

}

function updateHandler(req , res) {
  var newdata = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    password: encryptService.encrypt(req.body.password),
    level: req.body.level,
    token: req.body.token

  }
  var whereObj = {
      id: req.params.id
  }
  if(!(data.name && data.mobile && data.email && data.password && data.level && data.token))
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });
    else{
      sql.update(sql.users , newdata , whereObj , function(obj){
        res.send({
          error:false,
          response: "Updated successfully"
      });
      } );

    }
}
