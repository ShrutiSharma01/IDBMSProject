const db = require('../db/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require('sequelize');

module.exports = {
    register: async (req, res) => {
        let errors = {};
        const firstName = req.body.firstName || '';
        const lastName = req.body.lastName || null;
        const gender = (req.body.gender).toUpperCase() || '';
        const number = req.body.number || '';
        const dob = req.body.dob || '';
        const bloodType = (req.body.bloodType).toUpperCase() || '';
        const address1 = req.body.address1 || '';
        const address2 = req.body.address2 || null;
        const address3 = req.body.address3 || null;
        const medicalHistory = req.body.medicalHistory || null;

        if (firstName === '') {
            errors = {
                ...errors,
                firstName: 'Cannot be empty',
            }
        }
        if (address1 === '') {
            errors = {
                ...errors,
                address1: 'Cannot be empty',
            }
        }
        if (bloodType === '') {
            errors = {
                ...errors,
                bloodType: 'Cannot be empty',
            }
        } else {
            if (bloodType !== 'O-' && bloodType !== 'O+' && bloodType !== 'A+' && bloodType !== 'A-' && bloodType !== 'B+' && bloodType !== 'B-' && bloodType !== 'AB+' && bloodType !== 'AB-') {
                errors = {
                    ...errors,
                    bloodType: 'Not a valid blood type'
                }
            }
        }
        if (number === '') {
            errors = {
                ...errors,
                number: 'Cannot be empty',
            }
        } else if (parseInt(number) < 999999999 || parseInt(number) < 0 || parseInt(number) >= 10000000000) {
            errors = {
                ...errors,
                number: 'Incorrect contact number',
            }
        }
        if (dob === '') {
            errors = {
                ...errors,
                dob: 'Cannot be empty',
            }
        } else {
            let dobNew = new Date(dob);
            const age = ((new Date) - dobNew) / (86400 * 1000 * 365);

            if (age < 18) {
                errors = {
                    ...errors,
                    dob: 'Donor must be 18 years old.'
                }
            }
        }
        if (Object.keys(errors).length) {
            res.json({errors});
        } else {
            db.sequelize.query(`INSERT INTO donors (First_Name, Last_Name, Gender, ContactNumber, dob, bloodType,
                                                    address1, address2, address3, medical_history, createdAt, updatedAt)
                                VALUES ('${firstName}', '${lastName}', '${gender}', ${number},
                                        '${dob}', '${bloodType}', '${address1}', '${address2}',
                                        '${address3}', '${medicalHistory}', now(), now())`, {
                type: QueryTypes.INSERT
            }).then(result => {
                if (result) {
                    res.json({
                        message: 'Donor Added'
                    });
                }
            }).catch(err => console.log(err));
        }
    },

    authenticate: async (req, res) => {
        const userName = req.body.userName || '';
        const password = req.body.password || '';

        let errors = {};

        if (userName === '') {
            errors = {...errors, userName: 'This is required field. '};
        }
        if (password === '') {
            errors = {...errors, password: 'This is required field. '};
        }

        if (Object.keys(errors).length > 0) {
            res.json({errors});
        } else {
            db.sequelize.query(`SELECT password
                                FROM logins
                                WHERE username = '${userName}'`, {
                type: QueryTypes.SELECT
            }).then(result => {
                if (result[0]) {
                    bcrypt.compare(password, result[0].password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            const token = jwt.sign({
                                user: 'admin',
                            }, 'secretSauce', {
                                expiresIn: '1h'
                            });
                            res.json({
                                message: 'User Logged in ',
                                token,
                            })
                        } else {
                            res.json({
                                errors: {
                                    password: 'Incorrect password'
                                }
                            });
                        }
                    });
                } else {
                    res.json({errors: {userName: 'No such User'}});
                }
            }).catch(err => console.log(err));
        }
    },

    isAuthenticated: function (req, res, next) {
        if (!req.headers['authorization']) {
            res.status(403).json({error: "No token provided. "});
        } else {
            const authorizationHeader = req.headers['authorization'];
            const authorizationToken = authorizationHeader.split(' ')[1];

            if (authorizationToken) {
                jwt.verify(authorizationToken, 'secretSauce', (err, decoded) => {
                    if (err) {
                        console.log(err);
                        res.status(401).json({error: "Failed to authenticate. "});
                    } else {
                        req.admin = decoded.user;
                        next();
                    }
                });
            } else {
                res.status(403).json({error: "No token provided. "});
            }
        }
    },

    delDonor: async function (req, res) {
        db.sequelize.query(`DELETE
                            FROM donors
                            WHERE donorID = ${req.body.donorID}`, {
            type: QueryTypes.DELETE
        }).then(() => {
            res.json({message: 'patient deleted'});
        }).catch(err => {
            console.log(err);
            res.json({error: 'something went wrong.'});
        });
    },

    getAllDonors: async (req, res) => {
        db.sequelize.query(`SELECT *
                            FROM donors`, {
            type: QueryTypes.SELECT
        }).then(result => {
            console.log(result);
            res.json({data: result});
        }).catch(err => console.log(err));
    },

    donateBlood: async (req, res) => {
        db.sequelize.query(`SELECT bloodType, donorID
                            FROM donors
                            WHERE donorID = ${req.body.donorID}`, {
            type: QueryTypes.SELECT
        }).then(result => {
            console.log(result);
            if (result) {
                const date = new Date();
                date.setTime(date.getTime() + 42 * 86400000);
                db.sequelize.query(`INSERT INTO blood (bloodType, donatedDate, expiryDate, createdAt,
                                                       updatedAt, bloodBankID, donorID)
                                    VALUES ('${result[0].bloodType}', now(), '${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}', now(), now(),
                                            ${req.body.bank},
                                            ${req.body.donorID})`, {type: QueryTypes.INSERT}).then(res1 => {
                    if (res1) {
                        res.json({message: 'Blood Donated.'});
                    }
                });
            }
        }).catch(err => {
            console.log(err);
        });
    },

};