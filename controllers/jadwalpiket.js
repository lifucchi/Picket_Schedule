const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');

exports.getDataJadwalPiket = (req,res, next) => {
  JadwalPiket.findAll()
  .then(jadwalpiket => {
    res.render('./admin/jadwalpiket', {
      schedules: jadwalpiket,
      pageTitle: 'Jadwal Piket',
      path: '/jadwalpiket'
    });
  })
  .catch(err => console.log(err));
};
