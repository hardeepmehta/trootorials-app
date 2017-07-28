const apiService = require('services/apiService'),
apiConfig = require('config/apiConfig'),
logger = require('services/loggerService');

module.exports = function(app) {
  require('controllers/authController')(app);
  require('controllers/courseController')(app);
  require('controllers/userController')(app);
  require('controllers/videoController')(app);
  require('controllers/feedbackController')(app);
  require('controllers/startTutorialController')(app);
  require('controllers/summaryController')(app);
  require('controllers/mappingController')(app);
};
