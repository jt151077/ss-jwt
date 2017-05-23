var Promise = require('promise');
var redisClient = require('../config/redis').redisClient;
var redis = require('../config/redis').redis;

exports.writeToStore = function(userId, params) {
    return new Promise(function(resolve, reject) {
        const d = Date.now();
        //save access_token expiry timestamp
        params.expires_on = (params.expires_in * 100)+d;
        //save refresh_token expiry timestamp
        params.refresh_expires_on = (params.refresh_expires_in * 100)+d;

        redisClient.set(userId, JSON.stringify(params), function(err, reply) {
            if (err) {
                console.log('--> REDIS SET ERROR: '+JSON.stringify(err));
                reject(err);
            }
            else {
                console.log('--> REDIS SET success: '+reply);
                redisClient.expire(userId, params.refresh_expires_in);
                console.log('--> writeToStore d: ' + d);
                console.log('--> writeToStore access_token expire in: ' + params.expires_in);
                console.log('--> writeToStore access_token expire on: ' + params.expires_on);
                console.log('--> writeToStore refresh_token expire in: ' + params.refresh_expires_in);
                console.log('--> writeToStore refresh_token expire on: ' + params.refresh_expires_on);
                resolve();

            }
        });
    });
};

exports.readFromStore = function(userId) {
    //var params = JSON.parse(redisClient.get(userId));

    return new Promise(function(resolve, reject) {
        redisClient.get(userId, function(err, reply) {
            if (err) {
                console.log('--> REDIS SET ERROR: '+JSON.stringify(err));
                reject(err);
            }
            else {
                console.log('--> REDIS GET SUCCESS: '+reply);
                resolve(JSON.parse(reply));

            }
        });
    });
};

/**
 * @file angular-uuid-service is a tiny standalone AngularJS UUID/GUID generator service that is RFC4122 version 4 compliant.
 * @author Daniel Lamb <dlamb.open.source@gmail.com>
 */
exports.v4 = function() {
    var id = '', i;
    for(i = 0; i < 36; i++) {
        if (i === 14) {
            id += '4';
        }
        else if (i === 19) {
            id += '89ab'.charAt(getRandom(4));
        }
        else if(i === 8 || i === 13 || i === 18 || i === 23) {
            id += '-';
        }
        else
        {
            id += '0123456789abcdef'.charAt(getRandom(16));
        }
    }
    return id;
}

function getRandom(max) {
    return Math.random() * max;
}