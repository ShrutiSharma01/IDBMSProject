const donor = require('./DonorModel');
const patient = require('./PatientModel');
const blood = require('./BloodModel');
const requirement = require('./RequirementModel');
const bloodBank = require('./BloodBankModel');
const user = require('./UserModel');
const bloodDonated = require('./BloodDonated');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        name: DataTypes.STRING(255),
        email: DataTypes.STRING(255),
        username: DataTypes.STRING(45),
        password: DataTypes.STRING(100),
    }, {
        classMethods: {
            associate: function (models) {
                User.hasOne(models.Config)
            }
        },
        hooks: {
            afterCreate: function (user, options) {
                models.Config.create({
                    UserId: user.id
                })
            }
        }
    });
    return User;
};

module.exports = {
    donor,
    blood,
    patient,
    requirement,
    bloodBank,
    user,
    bloodDonated,
};