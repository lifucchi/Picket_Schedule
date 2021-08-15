const express = require('express');

const fasilitatorController = require('../controllers/fasilitator');
const anggotaController = require('../controllers/anggota');
const jadwalPiketController = require('../controllers/jadwalpiket');
const isAuth = require('../middleware/is-auth');
const mejaController = require('../controllers/meja');
const ruangController = require('../controllers/ruang');
const router = express.Router();

router.get('/', isAuth,fasilitatorController.getDashboard);
router.get('/laporan', isAuth,jadwalPiketController.getLaporan);
router.get('/laporan/:piketId', isAuth,jadwalPiketController.getDataLaporanDetail);



// router.get('/signup', authController.getSignup);
// router.post('/login', authController.postLogin);
// router.post('/signup', authController.postSignup);
// router.post('/logout', authController.postLogout);
// router.get('/logout', authController.getLogout);


module.exports = router;
