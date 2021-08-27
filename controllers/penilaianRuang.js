const Ruang = require('../models/ruang');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_ruang = require('../models/penilaian_ruang');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const { Op } = require("sequelize");

// Admin
exports.getDataPenilaianRuang= (req,res, next) => {

  const ruang = JadwalPiket.findAll(
    {
      include: [
    {
      model: Penilaian_ruang,
      include : {
        model: Ruang,
      }
    },
    {
      model: Pengguna,
      as: 'nik_pic_piket',
      where: { level: 1}
    }
  ]}
  );


  Promise
      .all([ruang])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          // console.log(hasil[0]);
          res.render('./admin/rekapitulasi', {
            rooms: hasil[0],
            pageTitle: 'Skor Ruang',
            // path: '/checklistruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });

};



exports.postDeletePenialaianRuang = ( req,res, next) => {
  const id = req.body.penilaianRuangId;
  console.log(id);
  Penilaian_ruang.findByPk(id)
    .then(penilaianRuang => {
      return penilaianRuang.destroy();
    })
    .then(result => {
      console.log('DESTROYED PENGGUNA');
      res.redirect('/admin/skorruang');
    })
    .catch(err => console.log(err));

};
