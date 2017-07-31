const apiService = require('services/apiService'),
  sql = require('services/sqlService'),
  apiConfig = require('config/apiConfig');

module.exports = function(app, passport) {

  // Get Start Tutorial
  app.get('/trootorials-v1/api/start-tutorial', getStartTutorialHandler);
};

function getStartTutorialHandler(req, res, next) {
  sql.findAll(sql.courses, {}, function(obj) {
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
