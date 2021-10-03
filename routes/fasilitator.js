const express = require('express');

const fasilitatorController = require('../controllers/fasilitator');
const anggotaController = require('../controllers/anggota');
const jadwalPiketController = require('../controllers/jadwalpiket');
const isAuth = require('../middleware/is-auth');
const mejaController = require('../controllers/meja');
const ruangController = require('../controllers/ruang');
const rekapitulasiController = require('../controllers/rekapitulasi');
const isRole = require('../middleware/is-role');
const buktiTemuanController = require('../controllers/buktitemuan');


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

router.get('/tindaklanjut/meja' , isAuth,isRole('Fasilitator'),buktiTemuanController.getDataTindakLanjutMejaFasilitator);
router.get('/tindaklanjut/meja/detail/:buktiId' , isAuth,isRole('Fasilitator'), buktiTemuanController.getDataTindakLanjutMejaFasilitatorDetail);
router.post('/tindaklanjut/bukti' , isAuth,isRole('Fasilitator'), buktiTemuanController.postTindakLanutFasilitator);

router.get('/tindaklanjut/ruang' , isAuth,isRole('Fasilitator'),buktiTemuanController.getDataTindakLanjutRuangFasilitator);
router.get('/tindaklanjut/ruang/detail/:buktiId' , isAuth,isRole('Fasilitator'), buktiTemuanController.getDataTindakLanjutRuangFasilitatorDetail);
router.post('/tindaklanjut/ruang/bukti' , isAuth,isRole('Fasilitator'), buktiTemuanController.postTindakLanutRuangFasilitator);

router.get('/buktitemuan/meja' , isAuth,isRole('Fasilitator'),buktiTemuanController.getDataBuktiTemuanMejaFasilitator);
router.get('/buktitemuan/meja/detail/:buktiId' , isAuth,isRole('Fasilitator'), buktiTemuanController.getDataBuktiTemuanMejaFasilitatorDetail);


router.get('/buktitemuan/ruang' , isAuth,isRole('Fasilitator'),buktiTemuanController.getDataBuktiTemuanRuangFasilitator);
router.get('/buktitemuan/ruang/detail/:buktiId' , isAuth,isRole('Fasilitator'), buktiTemuanController.getDataBuktiTemuanRuangFasilitatorDetail);

router.get('/artikel/:artikelId' , isAuth,isRole('Fasilitator'),fasilitatorController.getArtikelDetail);

// router.get('/signup', authController.getSignup);
// router.post('/login', authController.postLogin);
// router.post('/signup', authController.postSignup);
// router.post('/logout', authController.postLogout);
// router.get('/logout', authController.getLogout);


module.exports = router;
