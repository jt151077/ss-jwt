/*
 *
 * Main App file index.js
 * @author Jeremy Toussaint
 *
 *
 */

var dotenv = require('dotenv');
var http = require('http');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require('path');


/********* load environment variables *********/
dotenv.load();

/********* port config for aws deploy *********/
var port = process.env.PORT;

/********* loading modules and plugins *********/
var app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './node_modules')));
require('./routes/routes.js')(app);

/********* start the server *********/
http.createServer(app).listen(port, 'localhost');
console.log('--> Services listening on port', port);
