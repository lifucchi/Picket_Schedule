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
router.get('/checklistmeja', isAuth,  mejaController.getDataMejaAnggota);
router.get('/checklistruang', isAuth,  ruangController.getDataRuangAnggota);









module.exports = router;
