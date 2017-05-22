"use strict";
var secretToken = "changethisindev";
var fs = require('fs');
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
app.use(function (req, res, next) {
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

server.listen(8081, function () {
    console.log('Api volcraft is launched on port 8081');
});
var proc = require('child_process');
var mc_servers = {};
class Mc_server {
    constructor(name) {
        this.name = name;
        this.process = null;
    }
    send(command) {
        if (this.process) {
            this.process.stdin.write(command + "\r");
            return true;
        } else {
            return false;
        }
    }
    start() {

        if (!this.process) {
            this.process = proc.spawn("java",
                ['-jar', '-Xmx1024M', '-Xms4096M', 'minecraft.jar', 'nogui'],
                { cwd: './' + this.name + '/' });
            this.process.stdout.setEncoding('utf8');
            this.process.stderr.setEncoding('utf8');
            this.process.stdin.setEncoding('utf8');
            this.process.stdout.on('data', function (data) {
                io.to('admin').emit('stdout', {
                    server_name: this.name,
                    message: data
                });
            });
            this.process.stderr.on('data', function (data) {
                io.to('admin').emit('stderr', {
                    server_name: this.name,
                    message: data
                });
            });
            this.process.on('exit', function (data) {
                this.stop();
            }.bind(this));
            return true;
        } else {
            return false;
        }
    }
    stop() {
        if (this.process) {
            this.process = null;
            return true;
        } else {
            return false;
        }
    }
}
function getStructures(callback) {
    fs.readdir('./survival/world/structures/', (err, files) => {
        callback(files);
    });
}

var structures = [];
getStructures(function (res) {
    structures = res;
});
mc_servers['survival'] = new Mc_server('survival');
//mc_servers['survival'].start();
io.on('connection', function (socket) {
    socket.join('admin');
    socket.on('stdin', function (data) {
        mc_servers['survival'].send(data)
    });
    socket.emit('structures', structures);
    socket.on('update_structures', function () {
        getStructures(function (res) {
            structures = res;
            socket.emit('structures', structures);
        });
    });
    socket.on('start_server', function (data) {
        mc_servers[data.server_name].start();
    });
});

