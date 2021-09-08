const express = require('express');

const fasilitatorController = require('../controllers/fasilitator');
const anggotaController = require('../controllers/anggota');
const jadwalPiketController = require('../controllers/jadwalpiket');
const isAuth = require('../middleware/is-auth');
const mejaController = require('../controllers/meja');
const ruangController = require('../controllers/ruang');
const rekapitulasiController = require('../controllers/rekapitulasi');
const isRole = require('../middleware/is-role');

const router = express.Router();

router.get('/', isAuth,isRole('Fasilitator'),fasilitatorController.getDashboard);
router.get('/laporan', isAuth,isRole('Fasilitator'),jadwalPiketController.getLaporan);
router.get('/laporan/:piketId', isAuth,isRole('Fasilitator'),jadwalPiketController.getDataLaporanDetail);
router.post('/laporan/postCheckFasil', isAuth,isRole('Fasilitator'),  jadwalPiketController.postCheckFasil);

router.get('/rekapitulasi/meja', isAuth,isRole('Fasilitator'), rekapitulasiController.getDataRekapitulasiMeja);
router.post('/rekapitulasi/meja/filter-bulanan',isRole('Fasilitator'), isAuth, rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);
router.get('/rekapitulasi/meja/filter-bulanan',isRole('Fasilitator'), isAuth, rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);

router.get('/rekapitulasi/ruang', isAuth,isRole('Fasilitator'), rekapitulasiController.getDataRekapitulasiRuang);
router.post('/rekapitulasi/ruang/filter-mingguan', isAuth,isRole('Fasilitator'), rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.get('/rekapitulasi/ruang/filter-mingguan', isAuth,isRole('Fasilitator'), rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.post('/rekapitulasi/ruang/filter-bulanan', isAuth,isRole('Fasilitator'), rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.get('/rekapitulasi/ruang/filter-bulanan',isAuth,isRole('Fasilitator'),  rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.post('/rekapitulasi/ruang/filter-tahunan',isAuth,isRole('Fasilitator'), rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);
router.get('/rekapitulasi/ruang/filter-tahunan', isAuth,isRole('Fasilitator'),rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);




// router.get('/signup', authController.getSignup);
// router.post('/login', authController.postLogin);
// router.post('/signup', authController.postSignup);
// router.post('/logout', authController.postLogout);
// router.get('/logout', authController.getLogout);


module.exports = router;
