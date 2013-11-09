
/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express')
  , less = require('less')
  , connect = require('connect')
  , everyauth = require('everyauth')
  , nconf = require('nconf')
  , Recaptcha = require('recaptcha').Recaptcha;


/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* load configuration settings from ENV, then settings.json.  Contains keys for OAuth logins. See 
* settings.example.json.  
**/
nconf.env().file({file: 'settings.json'});
var app = module.exports = express.createServer();

/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
**/

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('./middleware/locals'));
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'azure zomg' }));
    app.use(everyauth.middleware());
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(connect.static(__dirname + '/public'));
    app.use(app.router);
});

/**
* ERROR MANAGEMENT
* -------------------------------------------------------------------------------------------------
* error management - instead of using standard express / connect error management, we are going
* to show a custom 404 / 500 error using jade and the middleware errorHandler (see ./middleware/errorHandler.js)
**/
var errorOptions = { dumpExceptions: true, showStack: true }
app.configure('development', function() { });
app.configure('production', function() {
    errorOptions = {};
});
app.use(require('./middleware/errorHandler')(errorOptions));



/**
* ROUTING
* -------------------------------------------------------------------------------------------------
**/

require('./routes/home')(app);
require('./routes/account')(app);

// Global Routes - this should be last!
require('./routes/global')(app);

/**
* RUN
**/

everyauth.helpExpress(app);
app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

