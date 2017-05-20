const Entity = require("./Entity");
class User extends Entity {
    constructor() {
        super();
        this._id = {
            value: ""
        }
        this.email = {
            type: String,
            required: true,
            trim: true,
            value: ""
        }
        this.pseudo = {
            type: String,
            unique: true,
            required: true,
            trim: true,
            value: ""
        }
        this.password = {
            type: String,
            required: true,
            value: ""
        }
        this.level_permission = {
            type: String,
            default: "USER",
            value: ""
        }
        this.created_at = {
            type: Date,
            default: Date.now,
            value: ""
        }
        this.last_connection = {
            type: Date,
            default: Date.now,
            value: ""
        }
        this.last_update = {
            type: Date,
            default: Date.now,
            value: ""
        }
        this.number_of_connection = {
            type: Number,
            default: 0,
            value: ""
        }
        this.last_ip = {
            type: String,
            value: ""
        }

        this.credit = {
            type: Number,
            value: ""
        }
    }
}
module.exports = User;