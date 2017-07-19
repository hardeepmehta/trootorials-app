var sql = require('services/sqlService');
const apiService = require('services/apiService'),
  apiConfig = require('config/apiConfig');
var encryptService = require('services/encryptionService');
var authenticate = require('services/authService');


module.exports = function(app, passport) {

  //Add a new user
  app.post('/api/add-user', addUserHandler);   //checked

  //Show all users
  app.get('/api/all-users', allUsersHandler); //checked

  //Get
  app.get('/api/get-user/:id', particularUserHandler);  //checked

  //Delete a user
  app.post('/api/delete-user/:id', deleteHandler);  //checked

  //Update a user
  app.post('/api/edit-user/:id', updateHandler);

  //Reset password
  app.post('/api/update-password/:id', resetPasswordHandler);

  //show password
  app.get('/api/show-password/:id', showPasswordHandler);

}

function allUsersHandler(req, res, next) {
 authenticate.auth(req,res,next, function( status ) {
   console.log("status"+status);
   sql.findAll(sql.users, {}, function(obj) {
     //console.log(obj);
     if (obj.error == true || obj.data.length == 0) {
       res.send({
         error: true,
         reason: "No data found"
       });}
       else if (!obj.data)
         res.send({
           error: true,
           reason: "No data found"
         });

     else {
       res.send(obj);
     }
   });
 });
}

function particularUserHandler(req, res) {
  var whereObj = {
    id: req.params.id
  }
  if (!req.params.id) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });
  } else {
    sql.findOne(sql.users, whereObj, function(obj) {
      if (!(obj.data.id)) {
        res.send({
          error: true,
          response: "User does not exist"
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

function addUserHandler(req, res) {
  var data = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    password: encryptService.encrypt(req.body.password),
    level: req.body.level,
    //token: req.body.token
  }
  if (!(data.name && data.mobile && data.email && data.password && data.level)) {
    res.send({
      error: true,
      reason: "Insufficient parameters"
    });
  } else {
    var whereObj = {
      email: req.body.email
    }
    sql.findOne(sql.users, whereObj, function(obj) {

      if (obj.data.id) {
        res.send({
          error: 'true',
          reason: 'User already exists'
        })

      } else {
        sql.insert(sql.users, data, function(obj) {
          res.send({
            error: false,
            response: "User created successfully"
          });
        })

      }
    })
  }
}

function deleteHandler(req, res) {
  var whereobj = {
    id: req.params.id
  }
  sql.findOne(sql.users, whereobj, function(obj) {
  if (!(obj.data.id)) {
    res.send({
      error: true,
      response: "User does not exist"
    })
  }
  else{
  sql.delete(sql.users, whereobj, function(obj) {
      res.send({
        error: false,
        response: "User deleted successfully!!"
      });
      })
}
})
}

function updateHandler(req, res) {
  var newdata = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    password: encryptService.encrypt(req.body.password),
    level: req.body.level,
    //token: req.body.token

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

  if (!(newdata.name && newdata.mobile && newdata.email && newdata.password && newdata.level))
    res.send({
      error: true,
      reason: "All data not filled"
    });
  else {
    sql.findOne(sql.users, whereObj, function(obj) {
    if (!(obj.data.id)) {
      res.send({
        error: true,
        response: "User does not exist"
      })
    }
    else {
      sql.update(sql.users, data, whereObj, function(obj) {
        res.send({
          error: false,
          response: "Updated successfully"
        });
      });
    }
  });
  }
}

function resetPasswordHandler(req, res) {
  var data = {};
  var whereObj = {
    id: req.params.id
  }
  sql.findOne(sql.users, whereObj, function(obj) {
      data.id = obj.data.id,
      data.name = obj.data.name,
      data.mobile = obj.data.mobile,
      data.email = obj.data.email,
      data.level = obj.data.level
  });

  var confirmPwd = req.body.confirm_password

  var pwd = {
    newPwd: req.body.new_password,
  }
  var whereObj = {
    id: req.params.id
  }
  if (pwd.newPwd == confirmPwd) {
    data.password = encryptService.encrypt(pwd.newPwd);
    sql.update(sql.users, data, whereObj, function(obj) {
      res.send({
        error: false,
        response: "Updated successfully"
      });
    });
  }
  else {
    res.send({
      error: true,
      response: "Password and confirm password donot match"
    });
  }
}

function showPasswordHandler(req, res) {
  var whereObj = {
    id: req.params.id
  }
  sql.findOne(sql.users, whereObj, function(obj) {
    if (obj.data.id) {
      res.send({
        error: false,
        password: encryptService.decrypt(obj.data.password)
      })
    } else {
      res.send({
        error: true,
        response: "Record doesn't exist"
      })
    }
  });
}
