var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
// GET /
router.get('/', function (req, res, next) {
        return res.render('home.pug', { title: "bonjour" });
});
router.get('/admin', function (req, res, next) {
        return res.render('admin.pug', { title: "bonjour" });
});
router.post('/survival/structure', function (req, res, next) {
        var form = new formidable.IncomingForm();
        form.multiples = false;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.uploadDir = "./survival/world/structures/";
        form.on('file', function (field, file) {
                fs.rename(file.path, form.uploadDir + "/" + file.name);
        });
        form.on('error', function (err) {
                console.log('File cant be upload: \n' + err);
                res.sendStatus(400);
        });
        form.on('end', function () {
                res.sendStatus(200);
                res.end('success');
        });
        form.parse(req);
})
module.exports = router;