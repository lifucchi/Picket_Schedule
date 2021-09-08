const express = require('express');

const fasilitatorController = require('../controllers/fasilitator');
const anggotaController = require('../controllers/anggota');
const jadwalPiketController = require('../controllers/jadwalpiket');
const isAuth = require('../middleware/is-auth');
const mejaController = require('../controllers/meja');
const ruangController = require('../controllers/ruang');
const rekapitulasiController = require('../controllers/rekapitulasi');
const router = express.Router();
router.get('/', isAuth,fasilitatorController.getDashboard);
router.get('/laporan', isAuth,jadwalPiketController.getLaporan);
router.get('/laporan/:piketId', isAuth,jadwalPiketController.getDataLaporanDetail);
router.post('/laporan/postCheckFasil', isAuth,  jadwalPiketController.postCheckFasil);

router.get('/rekapitulasi/meja', isAuth, rekapitulasiController.getDataRekapitulasiMeja);
router.post('/rekapitulasi/meja/filter-bulanan', isAuth, rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);
router.get('/rekapitulasi/meja/filter-bulanan', isAuth, rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);

router.get('/rekapitulasi/ruang', isAuth, rekapitulasiController.getDataRekapitulasiRuang);
router.post('/rekapitulasi/ruang/filter-mingguan', isAuth, rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.get('/rekapitulasi/ruang/filter-mingguan', isAuth, rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.post('/rekapitulasi/ruang/filter-bulanan', isAuth, rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.get('/rekapitulasi/ruang/filter-bulanan',isAuth,  rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.post('/rekapitulasi/ruang/filter-tahunan',isAuth, rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);
router.get('/rekapitulasi/ruang/filter-tahunan', isAuth,rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);




// router.get('/signup', authController.getSignup);
// router.post('/login', authController.postLogin);
// router.post('/signup', authController.postSignup);
// router.post('/logout', authController.postLogout);
// router.get('/logout', authController.getLogout);


module.exports = router;
