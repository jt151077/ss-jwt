var httpProxy = require('../services/HTTPproxy');
var Promise = require('promise');
var tokenStore = require('../services/tokenStore');
var tokenManager = require('../services/tokenManager');
var apiUser = this;

exports.getUserInfo = function() {
    'use strict';
    return function(req, res) {

        apiUser.getUser(res.locals.userId).then(
            function(user) {
                console.log('--> getUser success: ' + JSON.stringify(user));
                tokenManager.encryptToken(res.locals.userId).then(function(token) {
                    return res.status(200).json({
                        data: {
                            token: token,
                            user: user
                        }
                    });
                });
            },
            function(error) {
                console.log('--> getUser error: ' + JSON.stringify(error));
                res.status(403).json({message: 'unauthorised'});
            }
        );
    };
};

exports.getUser = function(userId) {
    return new Promise(function(resolve, reject) {

        tokenStore.readFromStore(userId).then(
            function(token) {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.access_token
                };

                httpProxy.sendRequest(headers, 'GET', process.env.AUTH_API_URL+'/userinfo', null).then(
                    function(success) {
                        resolve(success.body);
                    },
                    function(error) {
                        reject(error);
                    }
                );

            });
    });
}