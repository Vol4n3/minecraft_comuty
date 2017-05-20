function regLike(data) {
    var res = {};
    for (var i in data) {
        try {
            res[i] = new RegExp(data[i], 'i');
        } catch (err) {
            res[i] = data[i];
        }
    }
    return res;
}