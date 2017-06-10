var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
// GET /
router.get('/', function (req, res, next) {
        return res.render('home.pug', { title: "Accueil" });
});
router.get('/admin/console', function (req, res, next) {
        return res.render('home.pug', { title: "Console" });
});
router.get('/admin', function (req, res, next) {
        return res.render('login_admin.pug', { title: "Login" });
});
router.post('/admin/console', function (req, res, next) {
        if (req.body && req.body.pseudo == "volcraft" && req.body.pswd == "vtrank007")
        {
                return res.render('admin.pug', { title: "Admin" });
        }
        else
        {
                return res.render('home.pug', { title: "Mauvais pswd" });
        }
});
router.get('/stats',function(req,res,next){
        return res.render('stats.pug', { title: "Stats" });
});
router.post('/survival/structure', function (req, res, next) {
        var form = new formidable.IncomingForm();
        form.multiples = false;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.uploadDir = "./survival/world/structures/";
        form.onPart = function (part) {
                if (!part.filename || part.filename.match(/\.(nbt)$/i)) {
                        this.handlePart(part);
                }
                else {
                        console.log(part.filename + ' is not allowed');
                }
        }
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