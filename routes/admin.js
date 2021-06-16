const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/' , adminController.getAdminDashboard );



exports.routes = router;
// exports.products = products;
