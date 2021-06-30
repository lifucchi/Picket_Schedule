const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const anggotaController = require('../controllers/anggota');

const router = express.Router();


// dashboard
router.get('/', anggotaController.getDashboard);






module.exports = router;
