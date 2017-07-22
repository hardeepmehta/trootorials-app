const Sequelize = require('sequelize'),
  util = require('util'),
  path = require('path'),
  sequelize = new Sequelize(process.env['MYSQL_DB'], process.env['MYSQL_USERNAME'], process.env['MYSQL_PASSWORD'], {
    host: process.env['MYSQL_HOST'],
    port: process.env['MYSQL_PORT'],
    logging: false
  }),
  moment = require('moment');


var Course = sequelize.define('Course', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  duration: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
});


var User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  mobile: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  level: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true
});


var Video = sequelize.define('Video', {
  id: {
    type: Sequelize.INTEGER,
     autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  author: {
    type: Sequelize.STRING
  },
  duration: {
    type: Sequelize.STRING
  },
  file: {
    type: Sequelize.STRING
  },
  ispublic: {
    type: Sequelize.BOOLEAN
  }
}, {
  freezeTableName: true
});



var MapVideo = sequelize.define('MapVideo', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  courseid: {
    type: Sequelize.INTEGER
  },
  videoid: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true
});


var Member = sequelize.define('Member', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  loginid: {
    type: Sequelize.INTEGER
  },
  plan: {
    type: Sequelize.STRING
  },
  duration: {
    type: Sequelize.STRING
  },
  courseid: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true
});


var Payment = sequelize.define('Payment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  memberid: {
    type: Sequelize.INTEGER
  },
  mode: {
    type: Sequelize.STRING
  },
  courseid: {
    type: Sequelize.INTEGER
  },
  amount: {
    type: Sequelize.STRING
  },
  transactionid: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
});


var Feedback = sequelize.define('Feedback', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  loginid: {
    type: Sequelize.INTEGER
  },
  videoid: {
    type: Sequelize.INTEGER
  },
  feedback: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
});



var sendExports = {
  insert: function(table, createObj, callback) {
    sequelize.sync().then(function() {
      return table.create(createObj);
    }).then(function(data) {
      callback({
        error: false,
        data: data
      })
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },
  findOrCreate: function(table, whereObj, defaultsObj, callback) {
    table
      .findOrCreate({
        where: whereObj,
        defaults: defaultsObj
      })
      .then(function(data) {
        callback({
          error: false,
          data: data
        })
      }, function(err) {
        callback({
          error: true,
          data: err
        })
      });
  },
  findAll: function(table, whereObj, callback) {
    var order;
    if (whereObj.order) {
      delete whereObj.order;
      order = [
        ['createdAt', 'DESC']
      ];
    } else {
      delete whereObj.order;
      order = [
        ['createdAt', 'ASC']
      ];
    }
    table.findAll({
      where: whereObj,
      order: order
    }).then(function(projects) {
      callback({
        error: false,
        data: projects
      })
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },
  findPagination: function(table, whereObj, limit, offset, callback) {
    table.findAll({
      where: whereObj,
      order: [
        ['createdAt', 'DESC']
      ],
      offset: offset,
      limit: limit
    }).then(function(projects) {
      callback({
        error: false,
        data: projects
      })
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },
  findOne: function(table, whereObj, callback) {
    if (whereObj.order == false) {
      delete whereObj.order;
    } else {
      var order = [
        ['createdAt', 'ASC']
      ];
    }
    table.findAll({
      limit: 1,
      where: whereObj,
      order: order
    }).then(function(projects) {
      var sendProjects;
      if (projects[0]) {
        sendProjects = projects[0];
      } else {
        sendProjects = {};
      }
      callback({
        error: false,
        data: sendProjects
      })
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },
  findOneDesc: function(table, whereObj, callback) {
    if (whereObj.order == false) {
      delete whereObj.order;
    } else {
      var order = [
        ['createdAt', 'DESC']
      ];
    }
    table.findAll({
      limit: 1,
      where: whereObj,
      order: order
    }).then(function(projects) {
      var sendProjects;
      if (projects[0]) {
        sendProjects = projects[0];
      } else {
        sendProjects = {};
      }
      callback({
        error: false,
        data: sendProjects
      })
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },
  update: function(table, newObj, whereObj, callback) {
    table.update(newObj, {
      where: whereObj
    }).then(function() {
      callback({
        error: false
      })
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },
  delete: function(table, whereObj, callback) {
    table.destroy({
      where: whereObj
    }).then(function() {
      callback({
        error: false
      });
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },

  count: function(table, name, callback) {
    table.findAndCountAll({
      attributes: [name],
      group: name
    }).then(function(result) {
      callback({
        error: false,
        data: result
      })
    }, function(err) {
      callback({
        error: true,
        data: err
      })
    });
  },
  _findUsers: function(deliveryId, cb) {
    sendExports.findOneDesc(Users, {
      id: deliveryId
    }, function(response) {
      if (response.error) {
        sendExports._findUsers(deliveryId, cb);
      } else {
        if (response && response.data && response.data.dataValues && response.data.dataValues.id) {
          cb({
            askDetails: "false"
          });
        } else {
          cb({
            askDetails: "true"
          });
        }
      }
    });
  },
  _updateRealTime: function(table, findObj, obj, cb) {
    sendExports.update(table, obj, findObj, function(result) {
      if (result.error) {
        sendExports._updateRealTime(table, findObj, obj, cb);
      } else {
        cb(result);
      }
    });
  },
  _createRealTime: function(table, obj, cb) {
    sendExports.insert(table, obj, function(result) {
      if (result.error) {
        sendExports._createRealTime(table, obj, cb);
      } else {
        cb(result);
      }
    });
  },
  _findOrCreateRealTime: function(table, findObj, deliveryId, obj, cb) {
    sendExports.findOne(table, findObj, function(response) {
      if (response.error) {
        sendExports._findOrCreateRealTime(table, findObj, deliveryId, obj, cb);
      } else {
        if (response && response.data && response.data.dataValues && response.data.dataValues.id) {
          //Update User
          sendExports._updateRealTime(table, findObj, obj, cb);
        } else {
          //Create User
          sendExports._createRealTime(table, obj, cb);
        }
      }
    });
  },
  _returnRealTime: function(table, findObj, cb) {
    sendExports.findOne(table, findObj, function(response) {
      if (response.error) {
        cb(false, {
          data: 'Database error!'
        });
      } else {
        if (response && response.data && response.data.dataValues && response.data.dataValues.id) {
          cb(true, response);
        } else {
          cb(false, response);
        }
      }
    });
  },
  _returnAllRealTime: function(table, findObj, cb) {
    sendExports.findAll(table, findObj, function(response) {
      if (response.error) {
        cb(false, {
          data: 'Database error!'
        });
      } else {
        if (response && response.data && response.data.length > 0) {
          cb(true, response);
        } else {
          cb(false, response);
        }
      }
    });
  },
  query: function(query, callback) {
    sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT
    }).then(function(result) {
      callback({
        error: false,
        data: result
      });
    }, function(err) {
      callback({
        error: true,
        data: err
      });
    });
  },
  queryOutlets: function(query, callback) {
    sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT
    }).then(function(result) {
      callback({
        error: false,
        data: result
      });
    }, function(err) {
      callback({
        error: true,
        data: err
      });
    });
  },
  updateTransaction: function(table, newObj, whereObj, transaction, callback) {
    return table.update(newObj, {
      where: whereObj,
      transaction: transaction
    }, {}).then(function(data) {
      return callback({
        error: false,
        data: data
      })
    }, function(err) {
      return callback({
        error: true,
        data: err
      })
    });
  },
  findOneTransaction: function(table, whereObj, transaction, callback) {
    return table.findAll({
      limit: 1,
      where: whereObj,
      transaction: transaction,
      lock: transaction.LOCK.UPDATE
    }).then(function(projects) {
      var sendProjects;
      if (projects[0]) {
        sendProjects = projects[0];
      } else {
        sendProjects = {};
      }
      return callback({
        error: false,
        data: sendProjects
      })
    }, function(err) {
      return callback({
        error: true,
        data: err
      })
    });
  },

  courses: Course,
  users: User,
  video: Video,
  feedback: Feedback,
  mapvideo: MapVideo,
  member: Member,
  payment: Payment,
  Sequelize: sequelize
};

module.exports = sendExports;

//module.exports = Course;
