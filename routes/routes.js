var passport = require('passport');
require('../services/passport')(passport);
var tokenManager = require('../services/tokenManager');
/********* route includes *********/
var routes = {};
routes.auth = require('./api-auth');
routes.status = require('./api-status');
routes.user = require('./api-user');

module.exports = function(app) {
    'use strict';

    //server status
    app.get('/health',          tokenManager.verifyToken,            routes.status.getHealthStatus());

    //server status
    app.get('/userinfo',        tokenManager.verifyToken,            routes.user.getUserInfo());

    //login route and callback
    app.get('/auth',            passport.authenticate('provider'));
    app.get('/auth/callback',   passport.authenticate('provider'),          routes.auth.loginCallback);
};
