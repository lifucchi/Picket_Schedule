const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const anggotaController = require('../controllers/anggota');
const jadwalPiketController = require('../controllers/jadwalpiket');
const isAuth = require('../middleware/is-auth');
const mejaController = require('../controllers/meja');
const ruangController = require('../controllers/ruang');


const router = express.Router();


// dashboard
router.get('/', isAuth, anggotaController.getDashboard);
router.get('/jadwalpiket', isAuth,  jadwalPiketController.getJadwalPiketAnggota);
router.get('/checklistpiket', isAuth,  jadwalPiketController.getChecklistPiket);
router.get('/checklistpiket/detail/:piketId', isAuth,  jadwalPiketController.getDataChecklistPiketDetail);


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

module.exports = router;
