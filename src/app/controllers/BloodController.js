const db = require("../db/db.config");
const {QueryTypes} = require("sequelize");

module.exports = {
    addUser: async (req, res) => {
        let errors = {};
        const firstName = req.body.firstName || '';
        const lastName = req.body.lastName || null;
        const gender = req.body.gender || '';
        const number = req.body.number || '';
        const dob = req.body.dob || '';
        const bloodType = req.body.bloodType || '';
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
        }
        if (number === '') {
            errors = {
                ...errors,
                number: 'Cannot be empty',
            }
        } else if (parseInt(number) < 999999999) {
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
        }
        if (Object.keys(errors).length) {
            res.json({errors});
        } else {
            db.sequelize.query(`INSERT INTO patients (First_Name, Last_Name, Gender, ContactNumber, dob, bloodType,
                                                      address1, address2, address3, medical_history, createdAt,
                                                      updatedAt)
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

    getAll: async (req, res) => {
        db.sequelize.query(`SELECT *
                            FROM patients`, {
            type: QueryTypes.SELECT
        }).then(result => {
            console.log(result);
            res.json({data: result});
        }).catch(err => console.log(err));
    },

    deletePatient: async (req, res) => {
        db.sequelize.query(`DELETE
                            FROM patients
                            WHERE patientID = ${req.body.patientID}`, {
            type: QueryTypes.DELETE
        }).then(() => {
            res.json({message: 'patient deleted'});
        }).catch(err => {
            console.log(err);
            res.json({error: 'something went wrong.'});
        });
    },

    addReq: async (req, res) => {
        db.sequelize.query(`INSERT INTO requirements (reason, location, createdAt, updatedAt, patientID)
                            VALUES ('${req.body.reason}', '${req.body.location}', now(), now(),
                                    '${req.body.patientID}')`, {
            type: QueryTypes.INSERT
        }).then(result => {
            if (result) {
                console.log(result);
                res.json({message: 'Request added successfully.'});
            }
        }).catch(err => console.log(err));
    },

    addBank: async (req, res) => {
        db.sequelize.query(`INSERT INTO bloodBanks (name, location, createdAt, updatedAt)
                            VALUES ('${req.body.name}', '${req.body.location}', now(), now())`, {
            type: QueryTypes.INSERT,
        }).then(result => {
            if (result) {
                res.json({message: 'Blood Bank Added Successfully.'})
            }
        }).catch(er => console.log(er));
    },

    delBank: async (req, res) => {
        db.sequelize.query(`DELETE
                            FROM bloodBanks
                            WHERE bloodBankID = ${req.body.bankID}`, {
            type: QueryTypes.DELETE,
        }).then(() => {
            res.json({message: 'Blood Bank Deleted Successfully.'})
        }).catch(er => console.log(er));
    },

    allBanks: async (req, res) => {
        db.sequelize.query(`SELECT *
                            FROM bloodBanks`, {
            type: QueryTypes.SELECT,
        }).then(result => {
            if (result) {
                res.json({data: result});
            }
        }).catch(er => console.log(er));
    },

    allBlood: async (req, res) => {
        db.sequelize.query(`SELECT *
                            FROM blood`, {
            type: QueryTypes.SELECT
        }).then(result => {
            if (result) {
                result = result.sort((a, b) => {
                    return b.available - a.available;
                });
                res.json({data: result});
            }
        }).catch(er => console.log(er));
    },

    approve: async (req, res) => {
        db.sequelize.query(`SELECT *
                            FROM requirements
                            WHERE requestID = ${req.body.ID}`, {
            type: QueryTypes.SELECT
        }).then(result => {
            console.log(result);
            if (result) {
                db.sequelize.query(`INSERT INTO donatedBloods (requestID, reason, location, createdAt,
                                                               updatedAt, patientID, bloodID)
                                    VALUES (${result[0].requestID}, '${result[0].reason}', '${result[0].location}',
                                            now(), now(), ${result[0].patientID}, ${req.body.bloodID})`, {
                    type: QueryTypes.INSERT
                }).then(result1 => {
                    if (result1) {
                        res.json({message: 'Success'});
                    }
                }).catch(er => console.log(er));
            } else {
                res.json({message: 'No such request'});
            }
        }).catch(er => console.log(er));
    },

    allRequests: async (req, res) => {
        db.sequelize.query(`SELECT *
                            FROM requirements`, {
            type: QueryTypes.SELECT
        }).then(async result => {
            if (result) {
                result = await Promise.all(result.map(async request =>
                    await db.sequelize.query(`SELECT bloodType
                                              FROM patients
                                              WHERE patientID = ${request.patientID}`, {
                        type: QueryTypes.SELECT
                    }).then(result1 => ({
                        ...request,
                        bloodType: result1[0].bloodType,
                    })))).catch(er => console.log(er));

                // console.log(result);
                res.json({data: result});
            }
        }).catch(er => console.log(er));
    },

    getAllDonations: async (req, res) => {
        db.sequelize.query(`SELECT *
                            FROM donatedBloods`, {
            type: QueryTypes.SELECT
        }).then(async result => {
            if (result) {
                result = await Promise.all(result.map(async (result1) =>
                        await db.sequelize.query(`SELECT donorID
                                                  FROM blood
                                                  WHERE bloodID = ${result1.bloodID}`, {
                            type: QueryTypes.SELECT
                        }).then(res => {
                            // console.log(res[0].donorID);
                            return {
                                ...result1,
                                donorID: res[0].donorID,
                            }
                        }).catch(er => console.log(er))
                    )
                );
                // console.log(result);
                res.json({data: result});
            }
        }).catch(er => console.log(er));
    },

};