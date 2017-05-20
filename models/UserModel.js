var mongoose = require('mongoose');
const crypto = require('crypto');
const User = require("../entities/User");
var entity = new User();
const dbName = "user";
function crypt(data) {
    return crypto.createHmac('sha256', data)
        .update('likechocolate')
        .digest('hex')
}
var schema = new mongoose.Schema(entity.getSchema());


var model = mongoose.model(dbName, schema);
module.exports = model;