const bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
express = require('express'),
fs = require('fs'),
http = require('http'),
mime = require('mime-types'),
path = require('path'),
flash = require('connect-flash'),
// passport = require('passport'),
// passportLocal = require('passport-local'),
serveStatic = require('serve-static'),
expressSession = require('express-session');
var _ = require("lodash");
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");

// Load environment variables
require('dotenv').config({
    path: process.env.CONFIG_PATH || path.join(__dirname, '.env')
});

// Resolve module path
require('app-module-path').addPath(path.resolve(__dirname, './server'));

const logger = require('services/loggerService');
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

var app = express();

app.use('/trootorials-v1/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/uploads',  express.static(__dirname + '/uploads'));
app.use('/courseUploads',  express.static(__dirname + '/courseUploads'));
app.use('/userUploads',  express.static(__dirname + '/userUploads'));
app.use('/videoUploads',  express.static(__dirname + '/videoUploads'));


// Set path of static assets
if (NODE_ENV && typeof NODE_ENV !== "undefined" && (NODE_ENV == 'PROD' || NODE_ENV == 'BETA')) {
    app.set('isDevEnv', false);
    app.use(serveStatic(path.join(__dirname, '/dist'), {
        maxAge: '1y',
        setHeaders: function(res, path) {
            if (mime.lookup(path) === 'text/html') {
                res.setHeader('Cache-Control', 'public, max-age=0')
            } else {
                res.setHeader('Cache-Control', 'public, max-age=1y')
            }
        }
    }));
    logger.info('Directory set to /dist for env ' + NODE_ENV);
} else {
    app.set('isDevEnv', true);
    app.use(express.static(path.join(__dirname, '/public')));
    logger.info('Directory set to /public for env ' + NODE_ENV);
}

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// Middlewares
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})
.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}))
.use(bodyParser.json({ limit: '100mb' }))
// .use(cookieParser())
// .use(expressSession({
//     secret: 'comely-troofal',
//     resave: false,
//     saveUninitialized: false
// }))
.use(flash())
// .use(passport.initialize())
// .use(passport.session());


// Logging response time
app.use(function(req, res, next) {
    logger.info('Requested', req.url);
    var start = Date.now();
    res.on('finish', function() {
        var duration = Date.now() - start;
        logger.info('Response time for ' + req.url + ' is ' + duration + 'ms');
    });
    next();
});

// Setup api routes
require('services/routeService')(app);

// Error handler
app.use(function(err, req, res, next) {
    logger.error("Error: ", err);
    next(err);
});


var server = http.createServer(app).listen(PORT, function() {
    logger.log('info', 'Express server listening on port ' + PORT);
});
