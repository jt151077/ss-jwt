var Promise = require('promise');
var jwt = require('jsonwebtoken');
var btoa = require('btoa');
var tokenStore = require('./tokenStore');
var httpProxy = require('./HTTPproxy');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = process.env.SESSION_SECRET;
var tManager = this;

exports.verifyToken = function(req, res, next) {
    tManager.getUserId(req).then(
        function(userId) {
            console.log('--> verifyToken success: ' + userId);

            if(userId && userId !== null) {

                tokenStore.readFromStore(userId).then(
                    function(storedToken) {
                        console.log('--> verifyToken from store: ' + JSON.stringify(storedToken));

                        const d = Date.now();

                        if (storedToken && d < storedToken.refresh_expires_on) {
                            //refresh_token still valid
                            console.log('--> verifyToken refresh_token valid');

                            tManager.refreshIDToken(storedToken).then(
                                function(newTokens) {
                                    tokenStore.writeToStore(userId, newTokens).then(function() {
                                        res.locals.userId = userId;
                                        next();
                                    });
                                },
                                function(error) {
                                    console.log('--> refreshIDToken error: ' + JSON.stringify(error));
                                    res.status(403).json({message: 'unauthorised'});
                                }
                            );
                        }
                        else {
                            //identity token expired
                            console.log('--> verifyToken no token valid');
                            res.status(403).json({message: 'unauthorised'});
                        }
                    });
            }
            else {
                res.status(403).json({message: 'unauthorised'});
            }
        },
        function(error) {
            console.log('--> verifyToken error: ' + error);
            res.status(403).json({message: 'unauthorised'});
        }
    );
};

exports.getUserId = function(req) {
    return new Promise(function(resolve, reject) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            console.log('--> getToken from req.headers.authorization');
            tManager.decryptToken(req.headers.authorization.split(' ')[1]).then(
                function(token) {
                    //success
                    resolve(token);
                },
                function(error) {
                    //error, maybe need to handle better
                    reject(error);
                }
            );
        }
        else if (req.query && req.query.token) {
            console.log('--> getToken from req.query');
            tManager.decryptToken(req.query.token).then(
                function(token) {
                    //success
                    resolve(token);
                },
                function(error) {
                    //error, maybe need to handle better
                    reject(error);
                }
            );
        }
        else {
            resolve(null);
        }
    });
};

exports.encryptToken = function (textToEncrypt) {
    return new Promise(function(resolve, reject) {
        //TODO: this needs to be replaced by Amazon KMS
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(textToEncrypt,'utf8','hex')
        crypted += cipher.final('hex');

        //JWT business
        var encrypted = { token: crypted };
        //expire the token after the same duration as the Identity token
        var token = jwt.sign(encrypted, process.env.SESSION_SECRET, { expiresIn: 1800 });
        console.log('--> encryptToken: ' + token);
        resolve(token);
    });
};


exports.decryptToken = function(textToDecrypt){
    return new Promise(function(resolve, reject) {
        jwt.verify(textToDecrypt, process.env.SESSION_SECRET, function(err, decoded) {
            if (err) {
                console.log('--> decryptToken: error ' + err);
                reject(err);
            }
            else {
                var decipher = crypto.createDecipher(algorithm,password)
                var dec = decipher.update(decoded.token,'hex','utf8')
                dec += decipher.final('utf8');

                console.log('--> decryptToken: success ' + dec);
                resolve(dec);
            }
        });
    });
};

exports.refreshIDToken = function(storedToken) {
    return new Promise(function(resolve, reject) {

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(process.env.AUTH_CLIENT_ID+':'+process.env.AUTH_CLIENT_SECRET)
        };

        const payload = 'grant_type=refresh_token&refresh_token='+storedToken.refresh_token;

        httpProxy.sendRequest(headers, 'POST', process.env.AUTH_API_URL+'/token', payload).then(
            function(success) {
                resolve(success.body);
            },
            function(error) {
                reject(error);
            }
        );
    });
};