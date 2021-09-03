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

const penilaianRuangController = require('../controllers/penilaianRuang');
const penilaianMejaController = require('../controllers/penilaianMeja');


const buktiTemuanController = require('../controllers/buktitemuan');


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
router.get('/jadwalpiket/add' , jadwalPiketController.getFormJadwalPiket );
router.post('/jadwalpiket/add' , jadwalPiketController.postAddDataJadwalPiket );
router.post('/jadwalpiket/delete-jadwalpiket' , jadwalPiketController.postDeleteJadwalPiket );
router.post('/jadwalpiket/edit' , jadwalPiketController.postEditJadwal );
router.post('/jadwalpiket/import' , jadwalPiketController.postImportJadwal );

// artikel
router.get('/artikel' , artikelController.getDataArtikel );
router.get('/artikel/add' , artikelController.getFormArtikel );
router.post('/artikel/add' , artikelController.postAddDataArtikel );
router.post('/artikel/delete-artikel', artikelController.postDeleteArtikel);
router.get('/artikel/edit' , artikelController.getFormUpdateArtikel );
router.post('/artikel/update' , artikelController.postUpdateDataArtikel );

// checklistruang
router.get('/checklistruang',ruangController.getDataRuangAdmin);
router.post('/checklistruang',ruangController.postAddDataRuang);
router.post('/checklistruang/edit',ruangController.postEditRuang);
router.post('/checklistruang/delete-checklistruang', ruangController.postDeleteRuang );

// checklistmeja
router.get('/checklistmeja',mejaController.getDataMejaAdmin);
router.post('/checklistmeja',mejaController.postAddDataMeja);
router.post('/checklistmejastandar',mejaController.postAddDataAllMeja );

router.post('/checklistmeja/edit',mejaController.postEditMeja);
router.post('/checklistmeja/delete-checklistmeja',mejaController.postDeleteMeja );

// rekapitulasi ruang
router.get('/skorruang' , penilaianRuangController.getDataPenilaianRuang );
router.post('/skorruang/delete-skorruang' , penilaianRuangController.postDeletePenialaianRuang );
router.post('/skorruang/filter' , penilaianRuangController.getDataFilterPenilaianRuang );

// rekapitulasi meja
router.get('/skormeja' , penilaianMejaController.getDataPenilaianMeja );
router.post('/skormeja/filter' , penilaianMejaController.getDataFilterPenilaianMeja );
router.post('/skorruang/delete-skormeja' , penilaianMejaController.postDeletePenialaianMeja );

// buktiTemuan
router.get('/buktitemuanruang' , buktiTemuanController.getDataBuktiTemuanAdmin);
router.post('/buktitemuan/delete' , buktiTemuanController.postDeleteBuktiTemuanRuang);

router.get('/buktitemuanmeja' , buktiTemuanController.getDataBuktiTemuanMeja);






exports.routes = router;
// exports.products = products;
