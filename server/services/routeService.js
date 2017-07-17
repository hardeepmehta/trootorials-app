const apiService = require('services/apiService'),
    apiConfig = require('config/apiConfig'),
    logger = require('services/loggerService');

module.exports = function(app,passport) {
    require('controllers/authController')(app, passport);
<<<<<<< HEAD
    require('controllers/courseController')(app, passport);
    require('controllers/userController')(app, passport);
    // require('controllers/videoController')(app, passport);
=======
    require('controllers/videoController')(app, passport);
>>>>>>> c1093d5a21f210e7202815a51049763cfbdf76c6
};
