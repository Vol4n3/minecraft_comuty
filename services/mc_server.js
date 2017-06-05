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
                var tp_regex = /^\[[0-9:]{8}]\s\[Server\sthread\/INFO\]:\s<(§.)?(.*?)(§.)?>\s\.tp\s(.*?)\s/ig;
                var tp_find = [];
                while ((tp_find = tp_regex.exec(data)) !== null) {
                    let tp_cmd = 'tellraw '+ tp_find[4] +' ["",{"text":"' +
                        tp_find[2] + '","color":"aqua","bold":true,"underlined":true},{"text":" voudrait se téléporter à toi. ","color":"gold","bold":false,"underlined":false},{"text":"Accepter? ","color":"dark_green","bold":true,"clickEvent":{"action":"run_command","value":".tpaccept ' +
                        tp_find[2] + '"}},{"text":"Ou ","color":"none","bold":false},{"text":"Refuser?","color":"red","italic":true,"clickEvent":{"action":"run_command","value":".tpno '+
                        tp_find[2] +'"}}]';
                    this.process.stdin.write('scoreboard players tag '+ tp_find[2] +' add '+ tp_find[4] +'' + "\r");
                    this.process.stdin.write(tp_cmd + "\r");
                }
                var tpa_find = [];
                var tpa_regex = /^\[[0-9:]{8}]\s\[Server\sthread\/INFO\]:\s<(§.)?(.*?)(§.)?>\s\.tpaccept\s(.*?)\s/ig;
                while ((tpa_find = tpa_regex.exec(data)) !== null) {
                    this.process.stdin.write('tp @a[tag='+ tpa_find[2] +'] '+tpa_find[2]+'' + "\r");
                    this.process.stdin.write('scoreboard players tag '+ tpa_find[4] +' remove '+ tpa_find[2] +'' + "\r");
                }
                var tpno_find = [];
                var tpno_regex = /^\[[0-9:]{8}]\s\[Server\sthread\/INFO\]:\s<(§.)?(.*?)(§.)?>\s\.tpno\s(.*?)\s/ig;
                while ((tpno_find = tpno_regex.exec(data)) !== null) {
                    this.process.stdin.write('scoreboard players tag '+ tpno_find[4] +' remove '+ tpno_find[2] +'' + "\r");
                }
                tp_regex.exec(data);
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