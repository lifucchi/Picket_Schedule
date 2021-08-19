const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');

const moment = require('moment');
const Ruang = require('../models/ruang');
const sequelize = require('../util/database');

exports.getData = (req,res) => {
  // res.send('<h1>hello admin</h1>')
      res.render('./admin/rekapitulasi', {
        pageTitle: 'Dashboard',
        path: '/',

      })

};
