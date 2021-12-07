const db = require('../db/db.config');
const Sequelize = require("sequelize");
const patient = require('./PatientModel');
const blood = require('./BloodModel');
const donor = require('./DonorModel');

const donatedBlood = db.sequelize.define('donatedBlood', {
    requestID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    reason: Sequelize.STRING(100),
    location: Sequelize.STRING,
});

donatedBlood.belongsTo(patient, {
    foreignKey: {
        name: 'patientID',
        allowNull: true,
    },
    onDelete: 'cascade',
});

donatedBlood.belongsTo(blood, {
    foreignKey: {
        name: 'bloodID',
        allowNull: true,
    },
    onDelete: 'cascade',
});

donatedBlood.belongsTo(donor, {
    foreignKey: {
        name: 'donorID',
        allowNull: true
    },
    onDelete: 'cascade',
})

donatedBlood.sync().catch(er => console.log(er));

module.exports = donatedBlood;