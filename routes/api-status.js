var tokenManager = require('../services/tokenManager');

exports.getHealthStatus = function() {
    'use strict';
    return function(req, res) {
        tokenManager.encryptToken(res.locals.userId).then(function(token) {
            console.log('--> getHealthStatus: healthy');
            return res.status(200).json({
                data: {
                    token: token,
                    message: 'healthy'
                }
            });
        });
    };
};
