const db = require('../db/db.config');
const Sequelize = require("sequelize");
const donor = require('./DonorModel');
const bb = require('./BloodBankModel');

const blood = db.sequelize.define('blood', {
    bloodID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bloodType: Sequelize.STRING(3),
    donatedDate: Sequelize.DATEONLY,
    expiryDate: Sequelize.DATEONLY,
    available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
});

blood.belongsTo(bb, {
    foreignKey: {
        name: 'bloodBankID',
        allowNull: true,
    },
    onDelete: 'cascade'
});

blood.belongsTo(donor, {
    foreignKey: {
        name: 'donorID',
        allowNull: true,
    },
    onDelete: 'cascade'
})

blood.sync().catch(er => console.log(er));

module.exports = blood;