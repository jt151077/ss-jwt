var superagent = require('superagent');
var Promise = require('promise');

exports.sendRequest = function(headers, method, path, payload) {
    return new Promise(function(resolve, reject) {
        superagent(method, path)
            .set(headers)
            .send(payload)
            .end(function(error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
    });
};