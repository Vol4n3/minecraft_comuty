var proc = require('child_process');
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
    start(io) {

        if (!this.process) {
            this.process = proc.spawn("java",
                ['-jar', '-Xmx2048M', '-Xms1024M', 'minecraft.jar', 'nogui'],
                { cwd: './' + this.name + '/' });
            this.process.stdout.setEncoding('utf8');
            this.process.stderr.setEncoding('utf8');
            this.process.stdin.setEncoding('utf8');
            this.process.stdout.on('data', function (data) {
                var cmd_regex = /^\[[0-9:]{8}]\s\[Server\sthread\/INFO\]:\s<(§.)?(.*?)(§.)?>\s\.([^\s]+)\s([^!@\s]+)/ig;
                var cmd_find = [];
                while ((cmd_find = cmd_regex.exec(data)) !== null) {
                    if (cmd_find[4] == 'tp') {
                        let tp_cmd = 'tellraw ' + cmd_find[5] + ' ["",{"text":"' +
                            cmd_find[2] + '","color":"aqua","bold":true,"underlined":true},{"text":" voudrait se téléporter à toi. ","color":"gold","bold":false,"underlined":false},{"text":"Accepter? ","color":"dark_green","bold":true,"clickEvent":{"action":"run_command","value":".tpaccept ' +
                            cmd_find[2] + '"}},{"text":"Ou ","color":"none","bold":false},{"text":"Refuser?","color":"red","italic":true,"clickEvent":{"action":"run_command","value":".tpno ' +
                            cmd_find[2] + '"}}]';
                        this.process.stdin.write('scoreboard players tag ' + cmd_find[2] + ' add ' + cmd_find[5] + '' + "\r");
                        this.process.stdin.write('scoreboard players tag ' + cmd_find[5] + ' add ' + cmd_find[2] + '' + "\r");
                        this.process.stdin.write('scoreboard players set ' + cmd_find[2] + ' tpa 1' + "\r");
                        this.process.stdin.write('scoreboard players set ' + cmd_find[5] + ' tpa 1' + "\r");
                        this.process.stdin.write(tp_cmd + "\r");
                    } else if (cmd_find[4] == 'tpaccept') {
                        this.process.stdin.write('tp @a[tag=' + cmd_find[2] + ',score_tpa_min=1] @a[tag=' + cmd_find[5] + ',score_tpa_min=1]' + "\r");
                        this.process.stdin.write('scoreboard players tag ' + cmd_find[5] + ' remove ' + cmd_find[2] + '' + "\r");
                        this.process.stdin.write('scoreboard players tag ' + cmd_find[2] + ' remove ' + cmd_find[5] + '' + "\r");
                        this.process.stdin.write('scoreboard players set ' + cmd_find[5] + ' tpa 0' + "\r");
                        this.process.stdin.write('scoreboard players set ' + cmd_find[2] + ' tpa 0' + "\r");
                    } else if (cmd_find[4] == 'tpno') {
                        this.process.stdin.write('scoreboard players tag ' + cmd_find[5] + ' remove ' + cmd_find[2] + '' + "\r");
                        this.process.stdin.write('scoreboard players tag ' + cmd_find[2] + ' remove ' + cmd_find[5] + '' + "\r");
                        this.process.stdin.write('scoreboard players set ' + cmd_find[5] + ' tpa 0' + "\r");
                        this.process.stdin.write('scoreboard players set ' + cmd_find[2] + ' tpa 0' + "\r");
                    }
                }
                io.to('admin').emit('stdout', {
                    server_name: this.name,
                    message: data
                });
            }.bind(this));
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
module.exports = Mc_server;