const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const anggotaController = require('../controllers/anggota');
const jadwalPiketController = require('../controllers/jadwalpiket');
const isAuth = require('../middleware/is-auth');
const isRole = require('../middleware/is-role');
const mejaController = require('../controllers/meja');
const ruangController = require('../controllers/ruang');
const rekapitulasiController = require('../controllers/rekapitulasi');
const buktiTemuanController = require('../controllers/buktitemuan');

const router = express.Router();

// dashboard
router.get('/', isAuth, isRole('Anggota'), anggotaController.getDashboard);
router.get('/jadwalpiket', isAuth, isRole('Anggota'),jadwalPiketController.getJadwalPiketAnggota);
router.get('/checklistpiket', isAuth, isRole('Anggota'),  jadwalPiketController.getChecklistPiket);
router.get('/checklistpiket/detail/:piketId', isAuth,isRole('Anggota'),  jadwalPiketController.getDataChecklistPiketDetail);
router.post('/checklistPiket/postCheckPic', isAuth, isRole('Anggota'), jadwalPiketController.postCheckPic);

router.get('/checklistmeja/:mejaId', isAuth, isRole('Anggota'),  mejaController.getDataMeja);
router.get('/checklistruang/:ruangId', isAuth, isRole('Anggota'), ruangController.getDataRuang);


// router.get('/checklistmeja', isAuth,isRole('Anggota'), mejaController.getDataMejaAnggota);
router.get('/checklistmeja/detail/:mejaId',isAuth,isRole('Anggota'),  mejaController.getDataMejaDetail);
router.post('/checklistmeja/nilai', isAuth, isRole('Anggota'), mejaController.postNilaiMeja);
router.post('/checklistmeja/bukti', isAuth, isRole('Anggota'), mejaController.postBuktiTemuan);
router.post('/checklistmeja/postCheckPic', isAuth,isRole('Anggota'),  mejaController.postCheckPic);

router.get('/checklistruang', isAuth,  isRole('Anggota'),ruangController.getDataRuangAnggota);
router.get('/checklistruang/detail/:ruangId',isAuth, isRole('Anggota'), ruangController.getDataRuangDetail);
router.post('/checklistruang/nilai', isAuth, isRole('Anggota'), ruangController.postNilaiRuang);
router.post('/checklistruang/bukti', isAuth, isRole('Anggota'), ruangController.postBuktiTemuan);
router.post('/checklistruang/postCheckPic', isRole('Anggota'),isAuth,  ruangController.postCheckPic);

router.get('/rekapitulasi/ruang', isAuth,isRole('Anggota'), rekapitulasiController.getDataRekapitulasiRuang);
router.post('/rekapitulasi/ruang/filter-mingguan', isAuth,isRole('Anggota'),  rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.get('/rekapitulasi/ruang/filter-mingguan', isAuth,isRole('Anggota'),  rekapitulasiController.getDataRekapitulasiRuangFilterMingguan);
router.post('/rekapitulasi/ruang/filter-bulanan', isAuth,isRole('Anggota'), rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.get('/rekapitulasi/ruang/filter-bulanan', isAuth,isRole('Anggota'), rekapitulasiController.getDataRekapitulasiRuangFilterBulanan);
router.post('/rekapitulasi/ruang/filter-tahunan', isAuth,isRole('Anggota'), rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);
router.get('/rekapitulasi/ruang/filter-tahunan', isAuth,isRole('Anggota'), rekapitulasiController.getDataRekapitulasiRuangFilterTahunan);

router.get('/rekapitulasi/meja', isAuth,isRole('Anggota'), rekapitulasiController.getDataRekapitulasiMeja);
router.post('/rekapitulasi/meja/filter-bulanan', isAuth,isRole('Anggota'),  rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);
router.get('/rekapitulasi/meja/filter-bulanan', isAuth, isRole('Anggota'),rekapitulasiController.getDataRekapitulasiMejaFilterBulanan);

router.get('/buktitemuan/meja' , isAuth,isRole('Anggota'),buktiTemuanController.getDataBuktiTemuanMejaAnggota);
router.get('/buktitemuan/meja/detail/:buktiId' , isAuth,isRole('Anggota'), buktiTemuanController.getDataBuktiTemuanMejaAnggotaDetail);

router.get('/tindaklanjut/meja' , isAuth,isRole('Anggota'),buktiTemuanController.getDataTindakLanjutMejaAnggota);
router.get('/tindaklanjut/meja/detail/:buktiId' , isAuth,isRole('Anggota'), buktiTemuanController.getDataTindakLanjutMejaAnggotaDetail);
router.post('/tindaklanjut/bukti' , isAuth,isRole('Anggota'), buktiTemuanController.postTindakLanut);


router.get('/buktitemuan/ruang' , isAuth,isRole('Anggota') ,buktiTemuanController.getDataBuktiTemuanRuangAnggota);
router.get('/buktitemuan/ruang/detail/:buktiId' , isAuth,isRole('Anggota') ,buktiTemuanController.getDataBuktiTemuanRuangAnggotaDetail);

router.get('/tindaklanjut/ruang' , isAuth,isRole('Anggota') ,buktiTemuanController.getDataTindakLanjutRuangAnggota);
router.get('/tindaklanjut/ruang/detail/:buktiId' , isAuth,isRole('Anggota') ,buktiTemuanController.getDataTindakLanjutRuangAnggotaDetail);
router.post('/tindaklanjut/buktiruang' , isAuth,isRole('Anggota') ,buktiTemuanController.postTindakLanutRuang);

router.get('/artikel/:artikelId' , isAuth,isRole('Anggota'),anggotaController.getArtikelDetail);

module.exports = router;
