const Ruang = require('../models/ruang');
const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_ruang = require('../models/penilaian_ruang');
const Penilaian_meja = require('../models/penilaian_meja');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');

const sequelize = require('../util/database');
var Sequelize = require('sequelize')
var Op = Sequelize.Op

// Admin Ruang
exports.getDataBuktiTemuanAdmin= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianMejaId: {
                                    [Op.is]: null,
                                  }
                                },
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
          res.render('./admin/buktitemuanruang', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Ruang',
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataBuktiTemuanAdminFilter= (req,res, next) => {
  const bulanTahun = req.body.bulanTahun;
  const kategori = req.body.kategori;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');
  let setuju = 0;
  if (kategori === 'on'){
    setuju = 1;
  }else{
    setuju = 2;
  }

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: { tinjak_lanjut: setuju,
                                    penilaianMejaId: {
                                    [Op.is]: null,
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_ruang,
                          include : [
                            {model: Ruang},
                            {
                              model: JadwalPiket,
                              where: {
                                [Op.and]:
                                [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
                                {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
                                {persetujuan_fasil:2}],
                              },
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
          // console.log(hasil[0]);


          res.render('./admin/buktitemuanruang', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Ruang',
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataBuktiTemuanRuangDetail= (req,res, next) => {

  const id = req.params.buktiId;

  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_ruang,
        include: [
          {model: Ruang,
            include: {
              model: Pengguna,
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket',
          }}
        ]
      }
    ]
  })
  .then(bukti => {
    console.log('**********COMPLETE RESULTS****************');
    console.log(bukti);
    res.render('./admin/buktitemuanruangdetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Ruang',
      path: '/buktiruang'
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
      res.redirect('/admin/buktiTemuanruang');
    })
    .catch(err => console.log(err));

};



// Admin Meja
exports.getDataBuktiTemuanMeja= (req,res, next) => {
  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null,
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          include : [
                            {
                              model: Meja,
                              include : {
                                model: Pengguna,
                              }
                            },
                            {
                              model: JadwalPiket,
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
          res.render('./admin/buktitemuanmeja', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Meja',
            // path: '/checklistruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataBuktiTemuanMejaFilter= (req,res, next) => {

  const bulanTahun = req.body.bulanTahun;
  const kategori = req.body.kategori;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');
  let setuju = 0;
  if (kategori === 'on'){
    setuju = 1;
  }else{
    setuju = 2;
  }

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {tinjak_lanjut: setuju,
                                    penilaianRuangId: {
                                    [Op.is]: null,
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          include : [
                            {
                              model: Meja,
                              include : {
                                model: Pengguna,
                              }
                            },
                            {
                              model: JadwalPiket,
                              where: {
                                [Op.and]:
                                [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
                                {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
                                {persetujuan_fasil:2}],
                              },
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
          res.render('./admin/buktitemuanmeja', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Meja',
            // path: '/checklistruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataBuktiTemuanMejaDetail= (req,res, next) => {

  const id = req.params.buktiId;

  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_meja,
        include: [
          {model: Meja,
            include: {
              model: Pengguna,
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket',
          }}
        ]
      }
    ]
  })
  .then(bukti => {
    console.log('**********COMPLETE RESULTS****************');
    console.log(bukti);
    res.render('./admin/buktitemuanmejadetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Meja',
      path: '/buktimeja'
    });

  })
  .catch(err => {
      console.log('**********ERROR RESULT****************');
      console.log(err);
  });

};

exports.postDeleteBuktiTemuanMeja = ( req,res, next) => {
  const id = req.body.buktiTemuanId;
  console.log(id);
  Bukti_temuan.findByPk(id)
    .then(hasil => {
      return hasil.destroy();
    })
    .then(result => {
      res.redirect('/admin/buktiTemuanmeja');
    })
    .catch(err => console.log(err));

};

exports.postDeleteTindakLanjutMeja = ( req,res, next) => {
  const id = req.body.buktiTemuanId;
  console.log(id);
  Bukti_temuan.findByPk(id)
    .then(bukti => {
      bukti.deskripsi_sesudah=null;
      bukti.fotosesudah = null;
      bukti.tinjak_lanjut = 2;
      return bukti.save();
    })
    .then(result => {
      res.redirect('/admin/buktitemuanmeja/detail/'+id)

    })
    .catch(err => console.log(err));

};
// ANGGOTA

exports.getDataBuktiTemuanMejaAnggota= (req,res, next) => {

  console.log(req.session.user.nik);
  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null,
                                  },
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          include : [
                            {
                              model: Meja,
                              where: {penggunaNik: req.session.user.nik},
                              include : {
                                model: Pengguna,
                              }
                            },
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
          res.render('./anggota/buktitemuanmeja', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Meja',
            // path: '/checklistruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataBuktiTemuanMejaAnggotaDetail= (req,res, next) => {

  console.log(req.session.user.nik);
  const id = req.params.buktiId;

  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_meja,
        include: [
          {model: Meja,
            include: {
              model: Pengguna,
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket',
          }}
        ]
      }
    ]
  })
  .then(bukti => {
    console.log('**********COMPLETE RESULTS****************');
    res.render('./anggota/buktitemuanmejadetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Meja',
      path: '/buktimeja'
    });

  })
  .catch(err => {
      console.log('**********ERROR RESULT****************');
      console.log(err);
  });

};


exports.postTindakLanut= (req,res, next) => {

  const id = req.body.buktiId;
  const deskripsi = req.body.deskripsi;
  const image = req.files.image;

  Bukti_temuan.findByPk(id)
  .then(bukti => {
    console.log('**********COMPLETE RESULTS****************');
    if (image != null ){
        const imgUrl = image[0].path;
        bukti.deskripsi_sesudah=deskripsi;
        bukti.fotosesudah = imgUrl;
        bukti.tinjak_lanjut = 1;
        return bukti.save();

        }else {
          bukti.deskripsi_sesudah = deskripsi;
          bukti.tinjak_lanjut = 1;
          return bukti.save();
        }
  })
  .then( () => {
      res.redirect('/anggota/buktitemuan/meja/detail/'+id)

  })
  .catch(err => {
      console.log('**********ERROR RESULT****************');
      console.log(err);
  });

};
