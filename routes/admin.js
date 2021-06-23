const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');
const penggunaController = require('../controllers/pengguna');
const jadwalPiketController = require('../controllers/jadwalpiket');
const artikelController = require('../controllers/artikel');
// dashboard
router.get('/' , adminController.getAdminDashboard );

// pengguna
router.get('/pengguna' , penggunaController.getDataPengguna );
router.post('/pengguna' , penggunaController.postAddDataPengguna );
router.post('/pengguna/edit' , penggunaController.postEditPengguna );
router.post('/pengguna/delete-pengguna' , penggunaController.postDeletePengguna );
router.post('/pengguna/reset-password' , penggunaController.postResetPassword );
// Jadwal piket
router.get('/jadwalpiket' , jadwalPiketController.getDataJadwalPiket );

// artikel
router.get('/artikel' , artikelController.getDataArtikel );
router.get('/artikel/add' , artikelController.getFormArtikel );


exports.routes = router;
// exports.products = products;
