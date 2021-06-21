const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');
const penggunaController = require('../controllers/pengguna');
const jadwalPiketController = require('../controllers/jadwalpiket');

// dashboard
router.get('/' , adminController.getAdminDashboard );

// pengguna
router.get('/pengguna' , penggunaController.getDataPengguna );
router.post('/pengguna' , penggunaController.postAddDataPengguna );
// router.get('/pengguna/:penggunaId' , adminController.getDetailDataPengguna );

// Jadwal piket
router.get('/jadwalpiket' , jadwalPiketController.getDataJadwalPiket );

exports.routes = router;
// exports.products = products;
