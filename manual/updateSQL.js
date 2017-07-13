var path = require('path');
require('dotenv').config({
    path: process.env.CONFIG_PATH || path.join(__dirname,'..', '.env')
});

var _sql = require('../server/services/sqlService');
var sequelize = _sql.Sequelize;

sequelize.sync().then(function() {
    return
}).then(function(jane) {
    console.log('done');
});
