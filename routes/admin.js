const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const adminController = require('../controllers/admin');
const penggunaController = require('../controllers/pengguna');
const jadwalPiketController = require('../controllers/jadwalpiket');
const artikelController = require('../controllers/artikel');
const ruangController = require('../controllers/ruang');
const mejaController = require('../controllers/meja');
const penilaianRuangController = require('../controllers/penilaianRuang');
const penilaianMejaController = require('../controllers/penilaianMeja');
const buktiTemuanController = require('../controllers/buktitemuan');
const isAuth = require('../middleware/is-auth');
const isRole = require('../middleware/is-role');

const router = express.Router();


// dashboard
router.get('/', isAuth, isRole('Admin') , adminController.getAdminDashboard );

// pengguna
router.get('/pengguna' , isAuth, isRole('Admin'), penggunaController.getDataPengguna );
router.post('/pengguna' , isAuth, isRole('Admin'), penggunaController.postAddDataPengguna );
router.post('/pengguna/edit' , isAuth, isRole('Admin'), penggunaController.postEditPengguna );
router.post('/pengguna/delete-pengguna' , isAuth, isRole('Admin'), penggunaController.postDeletePengguna );
router.post('/pengguna/reset-password', isAuth, isRole('Admin') , penggunaController.postResetPassword );
// Jadwal piket
router.get('/jadwalpiket', isAuth, isRole('Admin') , jadwalPiketController.getDataJadwalPiket );
router.get('/jadwalpiket/add' , isAuth, isRole('Admin'), jadwalPiketController.getFormJadwalPiket );
router.post('/jadwalpiket/add' , isAuth, isRole('Admin'), jadwalPiketController.postAddDataJadwalPiket );
router.post('/jadwalpiket/delete-jadwalpiket' , isAuth, isRole('Admin'), jadwalPiketController.postDeleteJadwalPiket );
router.post('/jadwalpiket/edit' , isAuth, isRole('Admin'), jadwalPiketController.postEditJadwal );
router.post('/jadwalpiket/import' , isAuth, isRole('Admin'), jadwalPiketController.postImportJadwal );
router.get('/jadwalpiket/contohinput' , isAuth, isRole('Admin'), jadwalPiketController.getContohInput );



// artikel
router.get('/artikel' , isAuth, isRole('Admin'), artikelController.getDataArtikel );
router.get('/artikel/add' , isAuth, isRole('Admin'), artikelController.getFormArtikel );
router.post('/artikel/add' , isAuth, isRole('Admin'), artikelController.postAddDataArtikel );
router.post('/artikel/delete-artikel', isAuth, isRole('Admin'), artikelController.postDeleteArtikel);
router.get('/artikel/edit', isAuth, isRole('Admin') , artikelController.getFormUpdateArtikel );
router.post('/artikel/update', isAuth, isRole('Admin') , artikelController.postUpdateDataArtikel );

// checklistruang
router.get('/checklistruang', isAuth, isRole('Admin'),ruangController.getDataRuangAdmin);
router.post('/checklistruang', isAuth, isRole('Admin'),ruangController.postAddDataRuang);
router.post('/checklistruang/edit', isAuth, isRole('Admin'),ruangController.postEditRuang);
router.post('/checklistruang/delete-checklistruang' , isAuth, isRole('Admin'), ruangController.postDeleteRuang );

// checklistmeja
router.get('/checklistmeja', isAuth, isRole('Admin'),mejaController.getDataMejaAdmin);
router.post('/checklistmeja', isAuth, isRole('Admin'),mejaController.postAddDataMeja);
router.post('/checklistmejastandar', isAuth, isRole('Admin'),mejaController.postAddDataAllMeja );

router.post('/checklistmeja/edit', isAuth, isRole('Admin'),mejaController.postEditMeja);
router.post('/checklistmeja/delete-checklistmeja', isAuth, isRole('Admin'),mejaController.postDeleteMeja );

// rekapitulasi ruang
router.get('/skorruang' , isAuth, isRole('Admin'), penilaianRuangController.getDataPenilaianRuang );
router.post('/skorruang/delete-skorruang' , isAuth, isRole('Admin'), penilaianRuangController.postDeletePenialaianRuang );
router.post('/skorruang/filter' , isAuth, isRole('Admin'), penilaianRuangController.getDataFilterPenilaianRuang );

// rekapitulasi meja
router.get('/skormeja' , isAuth, isRole('Admin'), penilaianMejaController.getDataPenilaianMeja );
router.post('/skormeja/filter' , isAuth, isRole('Admin'), penilaianMejaController.getDataFilterPenilaianMeja );
router.post('/skorruang/delete-skormeja' , isAuth, isRole('Admin'), penilaianMejaController.postDeletePenialaianMeja );

// buktiTemuan
router.get('/buktitemuanruang' , isAuth, isRole('Admin'), buktiTemuanController.getDataBuktiTemuanAdmin);
router.post('/buktitemuan/delete' , isAuth, isRole('Admin'), buktiTemuanController.postDeleteBuktiTemuanRuang);
router.post('/buktitemuanruang/filter' , isAuth, isRole('Admin'), buktiTemuanController.getDataBuktiTemuanAdminFilter);
router.get('/buktitemuanruang/detail/:buktiId', isAuth, isRole('Admin'), buktiTemuanController.getDataBuktiTemuanRuangDetail);
router.post('/tindaklanjutruang/delete' , isAuth, isRole('Admin'), buktiTemuanController.postDeleteTindakLanjutRuang);


router.get('/buktitemuanmeja' , isAuth, isRole('Admin'), buktiTemuanController.getDataBuktiTemuanMeja);
router.post('/buktitemuanmeja/delete' , isAuth, isRole('Admin'), buktiTemuanController.postDeleteBuktiTemuanMeja);
router.post('/tindaklanjutmeja/delete' , isAuth, isRole('Admin'), buktiTemuanController.postDeleteTindakLanjutMeja);

router.post('/buktitemuanmeja/filter' , isAuth, isRole('Admin'), buktiTemuanController.getDataBuktiTemuanMejaFilter);
router.get('/buktitemuanmeja/detail/:buktiId', isAuth, isRole('Admin'), buktiTemuanController.getDataBuktiTemuanMejaDetail);

// exports.routes = router;
module.exports = router;

// exports.products = products;
