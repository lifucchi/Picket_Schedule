const Ruang = require('../models/ruang');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_ruang = require('../models/penilaian_ruang');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const { Op } = require("sequelize");

// Admin
exports.getDataBuktiTemuanAdmin= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          include: [
                        {
                          model: Penilaian_ruang,
                          include : [
                            {model: Ruang},
                            {
                              model: JadwalPiket,
                              where: {persetujuan_fasil: 2},
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket',
                              }
                            }
                          ],
                          required: true
                        }]
                      }
                    );


  Promise
      .all([buktiTemuan])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          console.log(hasil[0]);
          res.render('./admin/buktitemuanruang', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Ruang',
            // path: '/checklistruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.postDeleteBuktiTemuanRuang = ( req,res, next) => {
  const id = req.body.buktiTemuanId;
  console.log(id);
  Bukti_temuan.findByPk(id)
    .then(hasil => {
      return hasil.destroy();
    })
    .then(result => {
      console.log('DESTROYED BUKTI');
      res.redirect('/admin/buktiTemuanruang');
    })
    .catch(err => console.log(err));

};
