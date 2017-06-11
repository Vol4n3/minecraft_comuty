(function () {
    var formStats = document.getElementById('getStats');
    var blockRes = document.getElementById('resultat');
    function makeResult(data) {
        while (blockRes.firstChild) {
            blockRes.removeChild(blockRes.firstChild);
        }
        for (var k in data) {
            let el = document.createElement('div');
            el.textContent = k + ' : ' + data[k];
            blockRes.appendChild(el);
        }
    }
    formStats.addEventListener('submit', function (e) {
        e.preventDefault();
        var server = this['server'].value;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/mojang/username/' + this['pseudo'].value);
            xhr.responseType = 'json';
        xhr.send(null);
        xhr.onload = function () {
            let getId = xhr.response[0].id;
            let uuid = getId.slice(0, 8)
                + '-' + getId.slice(8, 12)
                + '-' + getId.slice(12, 16)
                + '-' + getId.slice(16, 20)
                + '-' + getId.slice(20);
            fetch('/stats/' + server + '/' + uuid + '.json').then(function (res) {
                return res.json();
            }).then(data => {
                makeResult(data);
            })
        }
    });
})();