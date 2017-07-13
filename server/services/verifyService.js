var encryptService = require('services/encryptionService');

module.exports = function (username, password, done){

    var checkData = {
        email: username,
        password: encryptService.encrypt( password )
    };

    if( username == 'john@doe' ) {
        //Should be same as of deserializeUser
        return done(null, {
            id: {
                id: '1234',
                name: 'John Doe'
            }
        });
    } else if( username == 'mary@jane' ) {
        return done(null, {
            id: {
                id: '6789',
                name: 'Mary Jane'
            }
        });
    } else {
        return done( null, false );
    }
};