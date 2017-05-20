"use strict";
var secretToken = "changethisindev";
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);


mongoose.connect("mongodb://localhost:27017/comuty");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var cookieParser = require("cookie-parser");
var sessionConfig = session({
    secret: secretToken,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
});
var sharedsession = require("express-socket.io-session");
app.use(sessionConfig);
io.use(sharedsession(sessionConfig, {
    autoSave: true
}));
app.use(function(req, res, next) {
    res.locals.currentUser = req.session.userId;
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
// include routes
var routes = require('./routes.js');
app.use('/', routes);

server.listen(8081, function() {
    console.log('Api volcraft is launched on port 8081');
});
var ioListener = require('./services/ioListener.js');
ioListener.use(io);