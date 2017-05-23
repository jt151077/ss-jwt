'use strict';

var redis = require('redis');

//this url comes from the heroku (dev) config - no need to run local redis service
var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
redisClient.on('connect', function () {
    console.log('--> Redis is ready on: '+process.env.REDIS_URL+':'+process.env.REDIS_PORT);
});

exports.redis = redis;
exports.redisClient = redisClient;