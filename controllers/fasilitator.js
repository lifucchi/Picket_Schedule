const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');

const moment = require('moment');
const Ruang = require('../models/ruang');

exports.getDashboard = (req,res) => {
  // res.send('<h1>hello admin</h1>')

  const nowTanggal = moment().format('YYYY-MM-DD');
  const nowTanggal2 = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

    JadwalPiket.findAll({
      where: {tanggal: nowTanggal},
      include: [{
        model: Pengguna,
        as: 'nik_pic_piket',
      },
      {
        model: Pengguna,
        as: 'nik_pic_fasil',
      }
    ]
  }).then(
    piket => {
      res.render('./fasilitator/dashboard', {
        pageTitle: 'Dashboard',
        path: '/',
        path: '/',
        schedules: piket,
        tanggal : nowTanggal2

      })
    }
  ).  catch(err => console.log(err));

};
