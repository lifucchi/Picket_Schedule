const express = require('express');

const fasilitatorController = require('../controllers/fasilitator');

const router = express.Router();

router.get('/', fasilitatorController.getDashboard);


// router.get('/signup', authController.getSignup);

// router.post('/login', authController.postLogin);

// router.post('/signup', authController.postSignup);

// router.post('/logout', authController.postLogout);
// router.get('/logout', authController.getLogout);


module.exports = router;
