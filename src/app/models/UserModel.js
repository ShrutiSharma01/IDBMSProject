const db = require('../db/db.config');
const Sequelize = require("sequelize");

const user = db.sequelize.define('login', {
    userID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: false
});

user.sync();

module.exports = user;