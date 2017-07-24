var sql = require('services/sqlService');
const apiService = require('services/apiService'),
  apiConfig = require('config/apiConfig');
var encryptService = require('services/encryptionService');
var authenticate = require('services/authService');


module.exports = function(app) {

  //Add a new user
  app.post('/api/add-user', addUserHandler); //checked

  //Show all users
  app.get('/api/all-users', allUsersHandler); //checked

  //Get
  app.get('/api/get-user/:id', particularUserHandler); //checked

  //Delete a user
  app.post('/api/delete-user/:id', deleteHandler); //checked

  //Update a user
  app.post('/api/edit-user/:id', updateHandler);

  //Reset password
  app.post('/api/update-password/:token', resetPasswordHandler);

  //show password
  app.get('/api/show-password/:token', showPasswordHandler);

}

function allUsersHandler(req, res, next) {
// var statusval=0;
//   authenticate.auth(req, res, next, function(status){
//     console.log("status" + status);
//     statusval = status
//   })

  //  if(statusval == 1)
  // {
    sql.findAll(sql.users, {}, function(obj) {
      //console.log(obj);
      if (obj.error == true || obj.data.length == 0) {
        res.send({
          error: true,
          reason: "No data found"
        });
      } else if (!obj.data)
        res.send({
          error: true,
          reason: "No data found"
        });

      else {
        res.send(obj);
      }
    });
  //}
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
          reason: 'User already created'
        })

      } else {
        sql.insert(sql.users, data, function(obj) {
          res.send({
            error: false,
            response: "User created successfully",
            data: obj
          });
        })

      }
    })
  }
}

function deleteHandler(req, res) {
  var whereObj = {
    id: req.params.id
  }
  sql.findOne(sql.users, whereObj, function(obj) {
    if (!req.params.id) {
      res.send({
        error: true,
        response: "Insufficient parameters"
      });
    } else if (!(obj.data.id)) {
      res.send({
        error: true,
        response: "User does not exist"
      })
    } else {
      sql.delete(sql.users, whereObj, function(obj) {
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
    level: req.body.level
  }
  console.log("level:"+ JSON.stringify(req.body.level))
  var whereObj = {
    id: parseInt(req.params.id)
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
      } else {
        sql.update(sql.users, newdata, whereObj, function(obj) {
          console.log(whereObj);
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
  var token = req.params.token;
  var uid = 0;
  var data = {};
  whereObj = {}
  authenticate.auth(req, res, function(status, id) {
    console.log("status" + status);
    console.log("id" + id);
    uid = id
    whereObj = {
      id: uid
    }
    sql.findOne(sql.users, whereObj, function(obj) {
      data.id = obj.data.id,
        data.name = obj.data.name,
        data.mobile = obj.data.mobile,
        data.email = obj.data.email,
        data.level = obj.data.level
    });
    var newPwd = req.body.new_password
    data.password = encryptService.encrypt(newPwd);
    console.log("data" + JSON.stringify(data));
    console.log("whereObj" + JSON.stringify(whereObj));

    sql.update(sql.users, data, whereObj, function(obj) {
      res.send({
        error: false,
        response: "Updated successfully"
      });
    });
  })
}


function showPasswordHandler(req, res) {
  var token = req.params.token;
  var uid = 0;
  authenticate.auth(req, res, function(status, id) {
    console.log("status" + status);
    console.log("id" + id);
    uid = id
    //    console.log("id"+typeof uid);
    var whereObj = {
      id: uid
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
  });
}
