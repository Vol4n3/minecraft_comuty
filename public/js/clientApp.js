/// <reference path="../../typings/index.d.ts" />
(function () {
    var $console_survival = $('#console-survival');
    var $console_skyblock = $('#console-skyblock');
    var $console_proxy = $('#console-proxy');
    var socket = io();
    function newLine(txt) {
        var line = document.createElement('p');
        line.textContent = txt;
        line.className = 'console_line';
        return line;
    }
    socket.on('stdout', function (data) {
        if (data.server_name == 'survival') {
            $console_survival.append(newLine(data.message));
            $console_survival.animate({ scrollTop: $console_survival.prop("scrollHeight") }, "slow");
        } else if (data.server_name == 'skyblock') {
            $console_skyblock.append(newLine(data.message));
            $console_skyblock.animate({ scrollTop: $console_skyblock.prop("scrollHeight") }, "slow");
        } else if (data.server_name == 'proxy') {
            $console_proxy.append(newLine(data.message));
            $console_proxy.animate({ scrollTop: $console_proxy.prop("scrollHeight") }, "slow");
        }
    });
    //survival command
    $('#send-command-survival').on('submit', function (e) {
        e.preventDefault();
        socket.emit('stdin', {
            'server_name': 'survival',
            'cmd': $('#command-survival').val()
        });
        $('#command-survival').val("");
    });
    $('#start-survival').on('click', function (e) {
        socket.emit('start_server', { server_name: 'survival' });
    });
    //skyblock command
    $('#send-command-skyblock').on('submit', function (e) {
        e.preventDefault();
        socket.emit('stdin', {
            'server_name': 'skyblock',
            'cmd': $('#command-skyblock').val()
        });
        $('#command-skyblock').val("");
    });
    $('#start-skyblock').on('click', function (e) {
        socket.emit('start_server', { server_name: 'skyblock' });
    });
    //proxy command
        $('#send-command-proxy').on('submit', function (e) {
        e.preventDefault();
        socket.emit('stdin', {
            'server_name': 'proxy',
            'cmd': $('#command-proxy').val()
        });
        $('#command-proxy').val("");
    });
    $('#start-proxy').on('click', function (e) {
        socket.emit('start_server', { server_name: 'proxy' });
    });
    /*structures*/
    /**
     * 
     * @param {Array} structs 
     */
    function listStructure(structs) {
        var $ul = $('#structures');
        $ul.empty();
        for (var s in structs) {
            var li = document.createElement('li');
            li.textContent = structs[s];
            $ul.append(li);
        }

    }
    socket.on('structures', function (data) {
        listStructure(data);
    });
    $('#send-structure').on('submit', function (e) {
        e.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/survival/structure');

        xhr.send(new FormData(document.getElementById('send-structure')));
        xhr.addEventListener('load', function (e) {
            $('#file_structure').val('');
            socket.emit('update_structures');
        })
    });
})()