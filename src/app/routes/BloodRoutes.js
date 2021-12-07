const express = require('express');
const router = express.Router();
const bankController = require('../controllers/BloodController');
const {isAuthenticated} = require("../controllers/UserController");

router.post('/addPatient', isAuthenticated, bankController.addUser);

router.get('/all', isAuthenticated, bankController.getAll);

router.delete('/delPatient', isAuthenticated, bankController.deletePatient);

router.post('/addReq', isAuthenticated, bankController.addReq);

router.post('/addBank', isAuthenticated, bankController.addBank);

router.delete('/delBank', isAuthenticated, bankController.delBank);

router.get('/allBanks', isAuthenticated, bankController.allBanks);

router.get('/bloodRecords', isAuthenticated, bankController.allBlood);

router.post('/approve', isAuthenticated, bankController.approve);

router.get('/allDonations', isAuthenticated, bankController.getAllDonations);

router.get('/requests/all', isAuthenticated, bankController.allRequests);

module.exports = router;