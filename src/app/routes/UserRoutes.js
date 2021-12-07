const express = require('express');
const usersControllers = require('../controllers/UserController');

const router = express.Router();

router.post('/addDonor', usersControllers.isAuthenticated, usersControllers.register);

router.get('/all', usersControllers.isAuthenticated, usersControllers.getAllDonors);

router.delete('/delDonor', usersControllers.isAuthenticated, usersControllers.delDonor);

router.post('/donate', usersControllers.isAuthenticated, usersControllers.donateBlood);

router.post('/login', usersControllers.authenticate);

module.exports = router;