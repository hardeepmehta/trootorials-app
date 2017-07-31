var sql = require('services/sqlService');
const apiService = require('services/apiService'),
apiConfig = require('config/apiConfig');
var encryptService = require('services/encryptionService');
var authenticate = require('services/authService');
var fs = require('fs');


module.exports = function(app) {

  //Add a new user
  app.post('/trootorials-v1/api/add-user/?', addUserHandler); //checked

  //Show all users
  app.get('/trootorials-v1/api/all-users/?', allUsersHandler); //checked

  //Get
  app.get('/trootorials-v1/api/get-user/:id/?', particularUserHandler); //checked

  //Delete a user
  app.post('/trootorials-v1/api/delete-user/:id/?', deleteHandler); //checked

  //Update a user
  app.post('/trootorials-v1/api/edit-user/:id/?', updateHandler);

  //Reset password
  app.post('/trootorials-v1/api/update-password/?', resetPasswordHandler);

  //show password
  app.get('/trootorials-v1/api/show-password/?', showPasswordHandler);

  //upload thumbnail
  app.post('/trootorials-v1/api/user/upload', uploadHandler);
}


function uploadHandler ( req , res ) {
  var form = new formidable.IncomingForm(),
      files = [],
      fields = [];
  // console.log("OS" + JSON.stringify(os))
  form.parse(req);

  form.uploadDir ='public/trootorials-v1/userUploads/'
  // os.tmpdir();

  form
    .on('field', function(field, value) {
      // console.log(field, value);
      // if(field == 'path')
      // console.log("My fielssssssss"+field)
      fields.push([field, value]);
    })
    .on('file', function(field, file) {
      // console.log(field, file);
      files.push([field, file]);
    })
    .on('end', function() {
      // console.log('-> upload done');
      // res.writeHead(200, {'content-type': 'text/plain'});
      // res.write('received fields:\n\n '+util.inspect(fields));
      // res.write('\n\n');
      // console.log("filess "+file)
      // res.end('received files:\n\n '+util.inspect(files.data));
      res.end(JSON.stringify(files));

    });
}

function allUsersHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {
      sql.findAll(sql.users, {}, function(obj) {
        ////console.log(obj);
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
    } else {
      res.send({
        error: 0
      });
    }
  })
}

function particularUserHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {
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
            obj.data.password = encryptService.decrypt(obj.data.password)
            res.send({
              error: false,
              response: obj
            });
          }
        });
      }
    } else {
      res.send({
        error: 0
      });
    }
  });
}


function addUserHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {
      var data = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        password: encryptService.encrypt(req.body.password),
        imageUrl: req.body.imageUrl.substring(req.body.imageUrl.lastIndexOf('/')+1),
        imagePath:process.env['USER_CDN_ADDRESS']+'userUploads/'+req.body.imageUrl.substring(req.body.imageUrl.lastIndexOf('/')+1),
        level: req.body.level,
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
              error: true,
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
    } else {
      res.send({
        error: 0
      });
    }
  })
}

function deleteHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    //console.log("status" + status);
    if (status) {

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
          if(obj.data.imageUrl != null){
            var filePath = "public/trootorials-v1/userUploads/"+obj.data.imageUrl;
            console.log("filepath "+ filePath)
            fs.unlinkSync(filePath,function(err){
              res.send({
                error:true,
                response:"File cannot be deleted"
              })
            });
          }
          sql.delete(sql.users, whereObj, function(obj) {
            res.send({
              error: false,
              response: "User deleted successfully!!"
            });
          })
        }
      })
    } else {
      res.send({
        error: 0
      });
    }
  })
}



function updateHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    if (status) {
      var newdata = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        level: req.body.level
      }
      var whereObj = {
        id: parseInt(req.params.id)
      }

      if (!req.params.id) {
        res.send({
          error: true,
          reason: "Insufficient parameters"
        });
      }

      if (!(newdata.name && newdata.mobile))
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
            if(req.body.imageUrl != null){
              var filePath = 'public/trootorials-v1/userUploads/'+obj.data.imageUrl;
              fs.unlinkSync(filePath);
              newdata = {
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                imageUrl: req.body.imageUrl.substring(req.body.imageUrl.lastIndexOf('/')+1),
                imagePath:process.env['USER_CDN_ADDRESS']+'userUploads/'+req.body.imageUrl.substring(req.body.imageUrl.lastIndexOf('/')+1),
                level: req.body.level
              }
            }
            sql.update(sql.users, newdata, whereObj, function(obj) {
              //console.log(whereObj);
              res.send({
                error: false,
                response: "Updated successfully"
              });
            });
          }
        })
      }
    } else {
      res.send({
        error: 0
      });
    }
  })
}

function resetPasswordHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    if (status) {
      var token = req.query.token;
      var uid = 0;
      var data = {};
      whereObj = {}

      authenticate.auth(req, res, function(status, id) {
        uid = id
        whereObj = {
          id: uid
        }
        sql.findOne(sql.users, whereObj, function(obj) {
          data.id = obj.data.id,
            data.name = obj.data.name,
            data.mobile = obj.data.mobile,
            data.email = obj.data.email,
            data.level = obj.data.level,
            data.password = encryptService.decrypt(obj.data.password)

            var newPwd = req.body.npassword
            var curPwd = req.body.cpassword

            // console.log("current sent "+curPwd)
            // console.log("current in db "+ data.password)
            // console.log("data "+JSON.stringify(data))

            if(curPwd != data.password)
            res.send({
              error: true,
              response: "Current password does not match"
            });

            else{
              data.password = encryptService.encrypt(newPwd);
              //console.log("data" + JSON.stringify(data));
              //console.log("whereObj" + JSON.stringify(whereObj));

              sql.update(sql.users, data, whereObj, function(obj) {
                res.send({
                  error: false,
                  response: "Updated successfully"
                });
              });
            }
        });

      })
    } else {
      res.send({
        error: 0
      });
    }
  })
}

function showPasswordHandler(req, res) {
  authenticate.auth(req, res, function(status) {
    //console.log("status in handler" + status);
    if (status) {
      var token = req.query.token;
      var uid = 0;
      authenticate.auth(req, res, function(status, id) {
        //console.log("status" + status);
        //console.log("id" + id);
        uid = id
        //    //console.log("id"+typeof uid);
        var whereObj = {
          id: uid
        }
        sql.findOne(sql.users, whereObj, function(obj) {
          //console.log(obj)
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
    } else {
      res.send({
        error: 0
      });
    }
  })
}
