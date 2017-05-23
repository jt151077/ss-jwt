var tokenManager = require('../services/tokenManager');

exports.loginCallback = function(req, res) {

    tokenManager.encryptToken(req.user).then(function(token) {
        tokenManager.oldToken = token;
        console.log('--> loginCallback: ' + token);
        res.redirect('/#/login?token='+token);
    });
};