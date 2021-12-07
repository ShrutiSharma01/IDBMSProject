const db = require('../db/db.config');
const Sequelize = require("sequelize");

const donor = db.sequelize.define('donor', {
    donorID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    First_Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Last_Name: Sequelize.STRING,
    Gender: Sequelize.CHAR(1),
    ContactNumber: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    dob: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    bloodType: {
        type: Sequelize.STRING(3),
        allowNull: false
    },
    address1: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    address2: Sequelize.STRING(20),
    address3: Sequelize.STRING(20),
    medical_history: Sequelize.STRING(500),
});

donor.sync().catch(er => console.log(er));

module.exports = donor;