const apiService = require('services/apiService'),
    apiConfig = require('config/apiConfig');

module.exports = function( app, passport ) {
    // Login User
    app.post('/api/login', passport.authenticate('local', {failureFlash: true} ), loginHandler);

    // Check if user is logged in
    app.get('/api/loggedin', isLoggedInHandler);

    // Logout User
    app.get('/api/logout', logoutHandler);
};

function loginHandler(req, res, next) {
    res.send({user: req.user});
}

function isLoggedInHandler(req, res, next) {
    res.send(req.isAuthenticated() ? req.user : '0');
}

function logoutHandler(req, res, next) {
    req.logout();
    res.redirect('/');
}