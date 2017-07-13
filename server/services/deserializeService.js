var encrypt = require('services/encryptionService');

module.exports = function ( id, done ){

    var checkData = {
        id: id.id
    };

    if( id.id == '1234' ) {
        return done(null, {
            id: '1234',
            name: 'John Doe'
        });
    } else {
        return done(null, {
            id: '6789',
            name: 'Mary Jane'
        });
    }
};