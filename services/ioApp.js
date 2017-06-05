var fs = require('fs');
var Mc_server = require('./mc_server.js');

class ioApp {
    constructor(io) {
        this.structures = [];
        this.mc_servers = {};
        this.mc_servers['survival'] = new Mc_server('survival');
        this.io = io;
        this.getStructures();
        this.init();
    }
    init() {
        this.io.on('connection', function (socket) {
            socket.join('admin');
            socket.on('stdin', function (data) {
                this.mc_servers['survival'].send(data)
            }.bind(this));
            socket.emit('structures', this.structures);
            socket.on('update_structures', function () {
                this.getStructures(function (res) {
                    this.structures = res;
                    socket.emit('structures', this.structures);
                }.bind(this));
            });
            socket.on('start_server', function (data) {
                this.mc_servers[data.server_name].start(this.io);
            }.bind(this));

            //todo: separate
            

        }.bind(this));
    }
    getStructures() {
        fs.readdir('./survival/world/structures/', function (err, files) {
            this.structures = files;
        }.bind(this));
    }
    getInstance() {
        return this.io;
    }
}
module.exports = ioApp;