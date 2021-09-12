const express = require('express');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', authController.getLogin);

// router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

// router.post('/signup', authController.postSignup);

// router.post('/logout', authController.postLogout);
router.get('/logout', authController.getLogout);

router.get('/changePassword', isAuth,authController.changePassword);
router.post('/changePassword', authController.changePasswordPengguna);



module.exports = router;
