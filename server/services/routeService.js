const apiService = require('services/apiService'),
    apiConfig = require('config/apiConfig'),
    logger = require('services/loggerService');

module.exports = function(app,passport) {
    require('controllers/authController')(app, passport);
    require('controllers/courseController')(app, passport);
    require('controllers/userController')(app, passport);
    require('controllers/videoController')(app, passport);
    require('controllers/feedbackController')(app, passport);    
};
