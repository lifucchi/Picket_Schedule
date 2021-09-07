const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const anggotaController = require('../controllers/anggota');
const jadwalPiketController = require('../controllers/jadwalpiket');
const isAuth = require('../middleware/is-auth');
const mejaController = require('../controllers/meja');
const ruangController = require('../controllers/ruang');
const rekapitulasiController = require('../controllers/rekapitulasi');



const router = express.Router();


// dashboard
router.get('/', isAuth, anggotaController.getDashboard);
router.get('/jadwalpiket', isAuth,  jadwalPiketController.getJadwalPiketAnggota);
router.get('/checklistpiket', isAuth,  jadwalPiketController.getChecklistPiket);
router.get('/checklistpiket/detail/:piketId', isAuth,  jadwalPiketController.getDataChecklistPiketDetail);
router.post('/checklistPiket/postCheckPic', isAuth,  jadwalPiketController.postCheckPic);

router.get('/checklistmeja/:mejaId', isAuth,  mejaController.getDataMeja);
router.get('/checklistruang/:ruangId', isAuth,  ruangController.getDataRuang);


router.get('/checklistmeja', isAuth,  mejaController.getDataMejaAnggota);
router.get('/checklistmeja/detail/:mejaId', isAuth,  mejaController.getDataMejaDetail);
router.post('/checklistmeja/nilai', isAuth,  mejaController.postNilaiMeja);
router.post('/checklistmeja/bukti', isAuth,  mejaController.postBuktiTemuan);
router.post('/checklistmeja/postCheckPic', isAuth,  mejaController.postCheckPic);

router.get('/checklistruang', isAuth,  ruangController.getDataRuangAnggota);
router.get('/checklistruang/detail/:ruangId', isAuth,  ruangController.getDataRuangDetail);
router.post('/checklistruang/nilai', isAuth,  ruangController.postNilaiRuang);
router.post('/checklistruang/bukti', isAuth,  ruangController.postBuktiTemuan);
router.post('/checklistruang/postCheckPic', isAuth,  ruangController.postCheckPic);

router.get('/rekapitulasi/ruang', rekapitulasiController.getDataRekapitulasiRuang);
router.post('/rekapitulasi/ruang/filter-mingguan', rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.get('/rekapitulasi/ruang/filter-mingguan', rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.post('/rekapitulasi/ruang/filter-bulanan', rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.get('/rekapitulasi/ruang/filter-bulanan', rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.post('/rekapitulasi/ruang/filter-tahunan', rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);
router.get('/rekapitulasi/ruang/filter-tahunan', rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);

router.get('/rekapitulasi/meja', rekapitulasiController.getDataRekapitulasiMeja);
router.post('/rekapitulasi/meja/filter-mingguan', rekapitulasiController.getDataRekapitulasiMejaFilterMingguan);
router.get('/rekapitulasi/meja/filter-mingguan', rekapitulasiController.getDataRekapitulasiMejaFilterMingguan);
router.post('/rekapitulasi/meja/filter-bulanan', rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);
router.get('/rekapitulasi/meja/filter-bulanan', rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);
router.post('/rekapitulasi/meja/filter-tahunan', rekapitulasiController.getDataRekapitulasiMejaFilterTahunan);
router.get('/rekapitulasi/meja/filter-tahunan', rekapitulasiController.getDataRekapitulasiMejaFilterTahunan);


module.exports = router;
