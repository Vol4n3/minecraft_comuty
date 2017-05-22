/// <reference path="../../typings/index.d.ts" />
(function () {
    var $console = $('#console');
    $console.height(400);
    $console.width(900);
    $console.css('overflow-y', 'scroll');
    var socket = io();
    function newLine(txt) {
        var line = document.createElement('p');
        line.textContent = txt;
        line.className = 'console_line';
        return line;
    }
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
    socket.on('stdout', function (data) {
        $console.append(newLine(data.message));
          $console.animate({ scrollTop: $console.height() }, "slow");
    });
    socket.on('structures', function (data) {
        listStructure(data);
    });
    $('#send-command').on('submit', function (e) {
        e.preventDefault();
        socket.emit('stdin', $('#command').val());
        $('#command').val("");
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
    $('#start_survival').on('click',function(e){
        socket.emit('start_server',{server_name : 'survival'});
    });
})()