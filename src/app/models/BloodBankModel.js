const db = require('../db/db.config');
const Sequelize = require("sequelize");

const bloodBank = db.sequelize.define('bloodBank', {
    bloodBankID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    location: {
        type: Sequelize.STRING,
        allowNull: false,
    },

});

bloodBank.sync().catch(er => console.log(er));

module.exports = bloodBank;