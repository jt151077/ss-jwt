'use strict';

var Strategy = require('passport-openidconnect').Strategy;
var tokenStore = require('./tokenStore');
var btoa = require('btoa');

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        console.log('--> serializeUser: ' + JSON.stringify(user));
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log('--> deserializeUser: ' + JSON.stringify(user));
        done(null, user);
    });

    passport.use('provider',
        new Strategy({
                authorizationURL: process.env.AUTH_API_URL + '/auth',
                tokenURL: process.env.AUTH_API_URL + '/token',
                userInfoURL: process.env.AUTH_API_URL + '/userinfo',
                clientID: process.env.AUTH_CLIENT_ID,
                clientSecret: process.env.AUTH_CLIENT_SECRET,
                callbackURL: process.env.AUTH_CALLBACK_URL,
                scope: ['AddScopeHere']
            },
            function(iss, sub, profile, jwtClaims, accessToken, refreshToken, params, next) {
                console.log('--> passport.use: ' + JSON.stringify(profile));
                params.refresh_token = refreshToken;
                const userId = profile.id+'---'+tokenStore.v4();
                tokenStore.writeToStore(userId, params).then(function() {
                    return next(null, userId);
                });
                /*return next(null, {
                    profile: profile,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    bearer: btoa(process.env.AUTH_CLIENT_ID + ':' + process.env.AUTH_CLIENT_SECRET)
                });*/
            }
    ));
};