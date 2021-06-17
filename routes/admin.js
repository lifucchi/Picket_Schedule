const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/' , adminController.getAdminDashboard );
router.get('/pengguna' , adminController.getDataPengguna );
router.post('/pengguna' , adminController.postAddDataPengguna );
router.get('/pengguna/:penggunaId' , adminController.getDetailDataPengguna );

exports.routes = router;
// exports.products = products;
