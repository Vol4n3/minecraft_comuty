var express = require('express');
var router = express.Router();
// GET /
router.get('/', function(req, res, next) {
        return res.render('home.pug', {title: "bonjour"});
});
module.exports = router;