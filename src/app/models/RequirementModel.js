const db = require('../db/db.config');
const Sequelize = require("sequelize");
const patient = require('./PatientModel');

const requirements = db.sequelize.define('requirement', {
    requestID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    reason: Sequelize.STRING(100),
    location: Sequelize.STRING,
});

requirements.belongsTo(patient, {
    foreignKey: {
        name: 'patientID',
        allowNull: true,
    },
    onDelete: 'cascade',
});

requirements.sync().catch(er => console.log(er));

module.exports = requirements;