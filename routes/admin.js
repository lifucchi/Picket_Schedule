const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');
const penggunaController = require('../controllers/pengguna');
const jadwalPiketController = require('../controllers/jadwalpiket');
const artikelController = require('../controllers/artikel');
const ruangController = require('../controllers/ruang');
const mejaController = require('../controllers/meja');

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
router.post('/artikel/add' , artikelController.postAddDataArtikel );
router.post('/artikel/delete-artikel', artikelController.postDeleteArtikel);

// checklistruang
router.get('/checklistruang',ruangController.getDataRuang);
router.post('/checklistruang',ruangController.postAddDataRuang);
router.post('/checklistruang/edit',ruangController.postEditRuang);
router.post('/checklistruang/delete-checklistruang', ruangController.postDeleteRuang );

// checklistmeja
router.get('/checklistmeja',mejaController.getDataMeja);
router.post('/checklistmeja',mejaController.postAddDataMeja);
router.post('/checklistmeja/edit',mejaController.postEditMeja);
router.post('/checklistmeja/delete-checklistmeja',mejaController.postDeleteMeja );

exports.routes = router;
// exports.products = products;
