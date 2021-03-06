const Ruang = require('../models/ruang');
const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_ruang = require('../models/penilaian_ruang');
const Penilaian_meja = require('../models/penilaian_meja');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const sequelize = require('../util/database');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

// Admin Ruang
exports.getDataBuktiTemuanAdmin= (req,res, next) => {
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }

  let buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianMejaId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_ruang,
                          include : [
                            {model: Ruang},
                            {
                              model: JadwalPiket,
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
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
          res.render('./admin/buktitemuanruang', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Ruang'
          });
      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataBuktiTemuanAdminFilter= (req,res, next) => {
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }

  const bulanTahun = req.body.bulanTahun;
  const kategori = +req.body.kategori;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');
  let setuju = 0;
  if (kategori === 1 ){
    setuju = 1;
  }else if (kategori === 2){
    setuju = 2;
  }else if (kategori === 3){
    setuju = 3;
  }

  let buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: { tinjak_lanjut: setuju,
                                    penilaianMejaId: {
                                    [Op.is]: null
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
                                {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)}]
                              },
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
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
          res.render('./admin/buktitemuanruang', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Ruang'
          });
      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataBuktiTemuanRuangDetail= (req,res, next) => {

  const id = req.params.buktiId;
  Bukti_temuan.findByPk(id, {
    include: [
      {
        model: Penilaian_ruang,
        include: [
          {model: Ruang,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }},
        ]
      },
      {
        model: Pengguna
      }
    ]
  })
  .then(bukti => {
    console.log('**********COMPLETE RESULTS****************');
    let status;

    if (bukti.penilaian_ruang.bobotruang == 1 || bukti.penilaian_ruang.bobotruang == 2){
      status = "Major";
    }else if (bukti.penilaian_ruang.bobotruang == 3 || bukti.penilaian_ruang.bobotruang == 4  ){
      status = "Minor";
    }

    res.render('./admin/buktitemuanruangdetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Ruang',
      path: '/buktiruang',
      status: status
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

exports.postDeleteTindakLanjutRuang = ( req,res, next) => {
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
      res.redirect('/admin/buktitemuanruang/detail/'+id);
    })
    .catch(err => console.log(err));

};

// Admin Meja
exports.getDataBuktiTemuanMeja= (req,res, next) => {
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }
  let buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          include : [
                            {
                              model: Meja,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        }],
                      }
                    );


  Promise
      .all([buktiTemuan])
      .then(hasil => {
          res.render('./admin/buktitemuanmeja', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Meja'
          });

      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataBuktiTemuanMejaFilter= (req,res, next) => {
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }

  const bulanTahun = req.body.bulanTahun;
  const kategori = +req.body.kategori;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');
  let setuju = 0;
  if (kategori === 1 ){
    setuju = 1;
  }else if (kategori === 2){
    setuju = 2;
  }else if (kategori === 3){
    setuju = 3;
  }


  let buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {tinjak_lanjut: setuju,
                                    penilaianRuangId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          include : [
                            {
                              model: Meja,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,
                              where: {
                                [Op.and]:
                                [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
                                {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)}]
                              },
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
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
          res.render('./admin/buktitemuanmeja', {
            rooms: hasil[0],
            pageTitle: 'Bukti Temuan Meja'
          });

      })
      .catch(err => {
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
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }}
        ]
      }
    ]
  })
  .then(bukti => {
    let status;

    if (bukti.penilaian_meja.bobotmeja == 1 || bukti.penilaian_meja.bobotmeja == 2){
      status = "Major";
    }else if (bukti.penilaian_meja.bobotmeja == 3 || bukti.penilaian_meja.bobotmeja == 4  ){
      status = "Minor";
    }
    res.render('./admin/buktitemuanmejadetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Meja',
      path: '/buktimeja',
      status: status
    });

  })
  .catch(err => {
      console.log(err);
  });

};

exports.postDeleteBuktiTemuanMeja = ( req,res, next) => {
  const id = req.body.buktiTemuanId;
  Bukti_temuan.findByPk(id)
    .then(hasil => {
      return hasil.destroy();
    })
    .then(result => {
      req.flash('success_messages', 'Bukti Temuan berhasil dihapus');

      res.redirect('/admin/buktiTemuanmeja');
    })
    .catch(err => console.log(err));
};

exports.postDeleteTindakLanjutMeja = ( req,res, next) => {
  const id = req.body.buktiTemuanId;
  console.log(id);
  Bukti_temuan.findByPk(id)
    .then(bukti => {
      bukti.deskripsi_sesudah =null;
      bukti.fotosesudah = null;
      bukti.tinjak_lanjut = 2;
      return bukti.save();
    })
    .then(result => {
      req.flash('success_messages', 'Tindak Lanjut berhasil dihapus');

      res.redirect('/admin/buktitemuanmeja/detail/'+id);
    })
    .catch(err => console.log(err));

};

// ANGGOTA MEJA
exports.getDataBuktiTemuanMejaAnggota= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          where: {
                            [Op.or]:
                            [
                              {bobotmeja:4},
                              {bobotmeja:3}
                            ]
                          },
                          include : [
                            {
                              model: Meja,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,

                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        }],
                        order: [
                            [{model:Penilaian_meja},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );

  const buktiTemuanMajor = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          where: {
                            [Op.or]:
                            [
                              {bobotmeja:2},
                              {bobotmeja:1}
                            ]
                          },
                          include : [
                            {
                              model: Meja,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,

                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        }],
                        order: [
                            [{model:Penilaian_meja},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );

  Promise
      .all([buktiTemuan, buktiTemuanMajor])
      .then(hasil => {
          res.render('./anggota/buktitemuanmeja', {
            rooms: hasil[0],
            rooms2: hasil[1],
            pageTitle: 'Bukti Temuan Meja'
          });

      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataBuktiTemuanMejaAnggotaDetail= (req,res, next) => {
  const id = req.params.buktiId;
  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_meja,
        include: [
          {model: Meja,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }}
        ]
      }
    ]
  })
  .then(bukti => {

    let status;

    if (bukti.penilaian_meja.bobotmeja == 1 || bukti.penilaian_meja.bobotmeja == 2){
      status = "Major";
    }else if (bukti.penilaian_meja.bobotmeja == 3 || bukti.penilaian_meja.bobotmeja == 4  ){
      status = "Minor";
    }
    res.render('./anggota/buktitemuanmejadetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Meja',
      path: '/buktimeja',
      status: status
    });

  })
  .catch(err => {
      console.log('**********ERROR RESULT****************');
      console.log(err);
  });
};

exports.getDataTindakLanjutMejaAnggota= (req,res, next) => {
  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null
                                  },
                                    tinjak_lanjut: 2
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          where: {
                            [Op.or]:
                            [
                              {bobotmeja:2},
                              {bobotmeja:1}
                            ]
                          },
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
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        }],
                        order: [
                            [{model:Penilaian_meja},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );
  Promise
      .all([buktiTemuan])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          res.render('./anggota/tindaklanjutmeja', {
            rooms: hasil[0],
            pageTitle: 'Tindak Lanjut Meja'
          });
      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataTindakLanjutMejaAnggotaDetail= (req,res, next) => {
  const id = req.params.buktiId;
  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_meja,
        include: [
          {model: Meja,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }}
        ]
      }
    ]
  })
  .then(bukti => {
    res.render('./anggota/tindaklanjutmejadetail', {
      rooms: bukti,
      pageTitle: 'Tindak Lanjut Meja',
      path: '/buktimeja'
    });

  })
  .catch(err => {
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

    const nowTanggal = moment().format('DD-MM-YYYY');

    if( bukti.deadline !== 'Invalid date'){
      if ( nowTanggal <= bukti.deadline ){
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
      }else {
        if (image != null ){
            const imgUrl = image[0].path;
            bukti.deskripsi_sesudah=deskripsi;
            bukti.fotosesudah = imgUrl;
            bukti.tinjak_lanjut = 3;
            return bukti.save();

            }else {
              bukti.deskripsi_sesudah = deskripsi;
              bukti.tinjak_lanjut = 3;
              return bukti.save();
            }
      }
    }else{
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
    }

  })
  .then( () => {
      res.redirect('/anggota/tindaklanjut/meja/detail/'+id);

  })
  .catch(err => {
      console.log(err);
  });

};

// ANggota ruang
exports.getDataBuktiTemuanRuangAnggota= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianMejaId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_ruang,
                          where: {
                            [Op.or]:
                            [
                              {bobotruang:4},
                              {bobotruang:3}
                            ]
                          },
                          include : [
                            {
                              model: Ruang,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        },
                        {
                          model: Pengguna
                        }
                      ],
                        order: [
                            [{model:Penilaian_ruang},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );

    const buktiTemuanMajor = Bukti_temuan
                        .findAll(
                          {
                            where: {
                                      penilaianMejaId: {
                                      [Op.is]: null
                                    }
                                  },
                            include: [
                          {
                            model: Penilaian_ruang,
                            where: {
                              [Op.or]:
                              [
                                {bobotruang:2},
                                {bobotruang:1}
                              ]
                            },
                            include : [
                              {
                                model: Ruang,
                                include : {
                                  model: Pengguna
                                }
                              },
                              {
                                model: JadwalPiket,
                                include : {
                                  model: Pengguna,
                                  as: 'nik_pic_piket'
                                }
                              }
                            ],
                            required: true
                          }],
                          order: [
                              [{model:Penilaian_ruang},{model: JadwalPiket},'tanggal', 'DESC']
                          ],
                        }
                      );

  Promise
      .all([buktiTemuan, buktiTemuanMajor])
      .then(hasil => {


          console.log('**********COMPLETE RESULTS****************');
          res.render('./anggota/buktitemuanruang', {
            rooms: hasil[0],
            rooms2: hasil[1],
            pageTitle: 'Bukti Temuan Ruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataBuktiTemuanRuangAnggotaDetail= (req,res, next) => {
  const id = req.params.buktiId;
  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_ruang,
        include: [
          {model: Ruang,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }},

        ]
      },
      {
        model: Pengguna
      }
    ]
  })
  .then(bukti => {
    let status;

    if (bukti.penilaian_ruang.bobotruang == 1 || bukti.penilaian_ruang.bobotruang == 2){
      status = "Major";
    }else if (bukti.penilaian_ruang.bobotruang == 3 || bukti.penilaian_ruang.bobotruang == 4  ){
      status = "Minor";
    }
    res.render('./anggota/buktitemuanruangdetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Ruang',
      path: '/buktiruang',
      status: status
    });

  })
  .catch(err => {
      console.log(err);
  });

};

exports.postTindakLanutRuang= (req,res, next) => {
  const id = req.body.buktiId;
  const deskripsi = req.body.deskripsi;
  const image = req.files.image;

  Bukti_temuan.findByPk(id)
  .then(bukti => {

    const nowTanggal = moment().format('DD-MM-YYYY');

    if( bukti.deadline !== 'Invalid date'){
      if ( nowTanggal <= bukti.deadline ){
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
      }else {
        if (image != null ){
            const imgUrl = image[0].path;
            bukti.deskripsi_sesudah=deskripsi;
            bukti.fotosesudah = imgUrl;
            bukti.tinjak_lanjut = 3;
            return bukti.save();

            }else {
              bukti.deskripsi_sesudah = deskripsi;
              bukti.tinjak_lanjut = 3;
              return bukti.save();
            }
      }
    }else{
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
    }


  })
  .then( () => {
      res.redirect('/anggota/tindaklanjut/ruang/detail/'+id);

  })
  .catch(err => {
      console.log('**********ERROR RESULT****************');
      console.log(err);
  });

};

exports.getDataTindakLanjutRuangAnggota= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianMejaId: {
                                    [Op.is]: null
                                  },
                                    penggunaNik: req.session.user.nik,
                                    tinjak_lanjut: 2
                                },
                          include: [
                        {
                          model: Penilaian_ruang,
                          where: {
                            [Op.or]:
                            [
                              {bobotruang:1},
                              {bobotruang:2}
                            ]
                          },
                          include : [
                            {
                              model: Ruang,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        },
                        {
                          model: Pengguna
                        }
                      ],
                        order: [
                            [{model:Penilaian_ruang},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );

  Promise
      .all([buktiTemuan])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          res.render('./anggota/tindaklanjutruang', {
            rooms: hasil[0],
            pageTitle: 'Tindak Lanjut Ruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });
};

exports.getDataTindakLanjutRuangAnggotaDetail= (req,res, next) => {
  const id = req.params.buktiId;
  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_ruang,
        include: [
          {model: Ruang,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }},

        ]
      },
      {model: Pengguna
      }
    ]
  })
  .then(bukti => {
    res.render('./anggota/tindaklanjutruangdetail', {
      rooms: bukti,
      pageTitle: 'Tindak Lanjut Ruang',
      path: '/buktiruang'
    });

  })
  .catch(err => {
      console.log(err);
  });
};

// fasilitator

exports.getDataTindakLanjutMejaFasilitator= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null
                                  },
                                    tinjak_lanjut: 2
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          where: {
                            [Op.or]:
                            [
                              {bobotmeja:2},
                              {bobotmeja:1}
                            ]
                          },
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
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        }],
                        order: [
                            [{model:Penilaian_meja},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );

  // const buktiTemuan = Bukti_temuan
  //                     .findAll(
  //                       {
  //                         where: {
  //                                   penilaianRuangId: {
  //                                   [Op.is]: null
  //                                 },
  //                                 tinjak_lanjut:{
  //                                   [Op.is]: 2
  //                                 }
  //                               },
  //                         include: [
  //                       {
  //                         model: Penilaian_meja,
  //                         where: {
  //                           [Op.or]:
  //                           [
  //                             {bobotmeja:2},
  //                             {bobotmeja:1}
  //                           ]
  //                         },
  //                         include : [
  //                           {
  //                             model: Meja,
  //                             include : {
  //                               model: Pengguna,
  //                               where: {nik: req.session.user.nik},
  //                             }
  //                           },
  //                           {
  //                             model: JadwalPiket,
  //                             include : {
  //                               model: Pengguna,
  //                               as: 'nik_pic_piket'
  //                             }
  //                           }
  //                         ],
  //                         required: true
  //                       }],
  //                       order: [
  //                           [{model:Penilaian_meja},{model: JadwalPiket},'tanggal', 'DESC']
  //                       ],
  //                     }
  //                   );


  Promise
      .all([buktiTemuan])
      .then(hasil => {
          res.render('./fasilitator/tindaklanjutmeja', {
            rooms: hasil[0],
            pageTitle: 'Tindak Lanjut Meja'
          });

      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataTindakLanjutMejaFasilitatorDetail= (req,res, next) => {
  const id = req.params.buktiId;

  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_meja,
        include: [
          {model: Meja,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }},
        ]
      },
    ]
  })
  .then(bukti => {
    res.render('./fasilitator/tindaklanjutmejadetail', {
      rooms: bukti,
      pageTitle: 'Tindak Lanjut Meja',
      path: '/buktimeja'
    });

  })
  .catch(err => {
      console.log(err);
  });

};

exports.postTindakLanutFasilitator= (req,res, next) => {
  const id = req.body.buktiId;
  const deskripsi = req.body.deskripsi;
  const image = req.files.image;

  Bukti_temuan.findByPk(id)
  .then(bukti => {

    const nowTanggal = moment().format('DD-MM-YYYY');

    if( bukti.deadline !== 'Invalid date'){
      if ( nowTanggal <= bukti.deadline ){
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
      }else {
        if (image != null ){
            const imgUrl = image[0].path;
            bukti.deskripsi_sesudah=deskripsi;
            bukti.fotosesudah = imgUrl;
            bukti.tinjak_lanjut = 3;
            return bukti.save();

            }else {
              bukti.deskripsi_sesudah = deskripsi;
              bukti.tinjak_lanjut = 3;
              return bukti.save();
            }
      }
    }else{
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
    }


  })
  .then( () => {
      res.redirect('/fasilitator/tindaklanjut/meja/detail/'+id);

  })
  .catch(err => {

      console.log(err);
  });

};

exports.getDataBuktiTemuanMejaFasilitator= (req,res, next) => {
  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianRuangId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_meja,
                          where: {
                            [Op.or]:
                            [
                              {bobotmeja:3},
                              {bobotmeja:4}
                            ]
                          },
                          include : [
                            {
                              model: Meja,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        }],
                        order: [
                            [{model:Penilaian_meja},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );

      const buktiTemuanMajor = Bukti_temuan
                          .findAll(
                            {
                              where: {
                                        penilaianRuangId: {
                                        [Op.is]: null
                                      }
                                    },
                              include: [
                            {
                              model: Penilaian_meja,
                              where: {
                                [Op.or]:
                                [
                                  {bobotmeja:1},
                                  {bobotmeja:2}
                                ]
                              },
                              include : [
                                {
                                  model: Meja,
                                  where: {penggunaNik: req.session.user.nik},
                                  include : {
                                    model: Pengguna
                                  }
                                },
                                {
                                  model: JadwalPiket,
                                  include : {
                                    model: Pengguna,
                                    as: 'nik_pic_piket'
                                  }
                                }
                              ],
                              required: true
                            },
                            {
                              model: Pengguna
                            }
                          ],
                            order: [
                                [{model:Penilaian_meja},{model: JadwalPiket},'tanggal', 'DESC']
                            ],
                          }
                        );


  Promise
      .all([buktiTemuan, buktiTemuanMajor])
      .then(hasil => {
          res.render('./fasilitator/buktitemuanmeja', {
            rooms: hasil[0],
            rooms2: hasil[1],
            pageTitle: 'Bukti Temuan Meja'
          });

      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataBuktiTemuanMejaFasilitatorDetail= (req,res, next) => {
  const id = req.params.buktiId;

  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_meja,
        include: [
          {model: Meja,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }},
        ]
      }
    ]
  })
  .then(bukti => {

    let status;

    if (bukti.penilaian_meja.bobotmeja == 1 || bukti.penilaian_meja.bobotmeja == 2){
      status = "Major";
    }else if (bukti.penilaian_meja.bobotmeja == 3 || bukti.penilaian_meja.bobotmeja == 4  ){
      status = "Minor";
    }
    res.render('./fasilitator/buktitemuanmejadetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Meja',
      path: '/buktimeja',
      status: status
    });

  })
  .catch(err => {
      console.log(err);
  });

};

exports.getDataBuktiTemuanRuangFasilitator= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianMejaId: {
                                    [Op.is]: null
                                  }
                                },
                          include: [
                        {
                          model: Penilaian_ruang,
                          where: {
                            [Op.or]:
                            [
                              {bobotruang:4},
                              {bobotruang:3}
                            ]
                          },
                          include : [
                            {
                              model: Ruang,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        },
                        {
                          model: Pengguna
                        }
                      ],
                        order: [
                            [{model:Penilaian_ruang},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );

    const buktiTemuanMajor = Bukti_temuan
                        .findAll(
                          {
                            where: {
                                      penilaianMejaId: {
                                      [Op.is]: null
                                    }
                                  },
                            include: [
                          {
                            model: Penilaian_ruang,
                            where: {
                              [Op.or]:
                              [
                                {bobotruang:2},
                                {bobotruang:1}
                              ]
                            },
                            include : [
                              {
                                model: Ruang,
                                include : {
                                  model: Pengguna
                                }
                              },
                              {
                                model: JadwalPiket,
                                include : {
                                  model: Pengguna,
                                  as: 'nik_pic_piket'
                                }
                              }
                            ],
                            required: true
                          }],
                          order: [
                              [{model:Penilaian_ruang},{model: JadwalPiket},'tanggal', 'DESC']
                          ],
                        }
                      );


  Promise
      .all([buktiTemuan,buktiTemuanMajor])
      .then(hasil => {
          res.render('./fasilitator/buktitemuanruang', {
            rooms: hasil[0],
            rooms2:hasil[1],
            pageTitle: 'Bukti Temuan Ruang'
          });

      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataBuktiTemuanRuangFasilitatorDetail= (req,res, next) => {
  const id = req.params.buktiId;

  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_ruang,
        include: [
          {model: Ruang,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }},
        ]
      },
      {model: Pengguna
      }
    ]
  })
  .then(bukti => {

    let status;

    if (bukti.penilaian_ruang.bobotruang == 1 || bukti.penilaian_ruang.bobotruang == 2){
      status = "Major";
    }else if (bukti.penilaian_ruang.bobotruang == 3 || bukti.penilaian_ruang.bobotruang == 4  ){
      status = "Minor";
    }
    res.render('./fasilitator/buktitemuanruangdetail', {
      rooms: bukti,
      pageTitle: 'Bukti Temuan Ruang',
      path: '/buktiruang',
      status: status
    });

  })
  .catch(err => {
      console.log(err);
  });

};

exports.getDataTindakLanjutRuangFasilitator= (req,res, next) => {

  const buktiTemuan = Bukti_temuan
                      .findAll(
                        {
                          where: {
                                    penilaianMejaId: {
                                    [Op.is]: null
                                  },
                                    penggunaNik: req.session.user.nik,
                                    tinjak_lanjut: 2
                                },
                          include: [
                        {
                          model: Penilaian_ruang,
                          where: {
                            [Op.or]:
                            [
                              {bobotruang:1},
                              {bobotruang:2}
                            ]
                          },
                          include : [
                            {
                              model: Ruang,
                              include : {
                                model: Pengguna
                              }
                            },
                            {
                              model: JadwalPiket,
                              include : {
                                model: Pengguna,
                                as: 'nik_pic_piket'
                              }
                            }
                          ],
                          required: true
                        },
                        {
                          model: Pengguna
                        }
                      ],
                        order: [
                            [{model:Penilaian_ruang},{model: JadwalPiket},'tanggal', 'DESC']
                        ],
                      }
                    );


  // const buktiTemuan = Bukti_temuan
  //                     .findAll(
  //                       {
  //                         where: {
  //                                   penilaianMejaId: {
  //                                   [Op.is]: null,
  //                                 },
  //                                 penggunaNik: req.session.user.nik,
  //                                 tinjak_lanjut:{
  //                                   [Op.is]: 2
  //                                 }
  //                               },
  //                         include: [
  //                       {
  //                         model: Penilaian_ruang,
  //                         where: {
  //                           [Op.or]:
  //                           [
  //                             {bobotruang:1},
  //                             {bobotruang:2}
  //                           ]
  //                         },
  //                         include : [
  //                           {
  //                             model: Ruang,
  //                             include : {
  //                               model: Pengguna
  //                             }
  //                           },
  //                           {
  //                             model: JadwalPiket,
  //                             include : {
  //                               model: Pengguna,
  //                               as: 'nik_pic_piket'
  //                             }
  //                           }
  //                         ],
  //                         required: true
  //                       }],
  //                       order: [
  //                           [{model:Penilaian_ruang},{model: JadwalPiket},'tanggal', 'DESC']
  //                       ],
  //                     }
  //                   );


  Promise
      .all([buktiTemuan])
      .then(hasil => {
          res.render('./fasilitator/tindaklanjutruang', {
            rooms: hasil[0],
            pageTitle: 'Tindak Lanjut Ruang'
          });

      })
      .catch(err => {
          console.log(err);
      });
};

exports.getDataTindakLanjutRuangFasilitatorDetail= (req,res, next) => {
  const id = req.params.buktiId;

  Bukti_temuan.findByPk(id, {
    include: [
      {model: Penilaian_ruang,
        include: [
          {model: Ruang,
            include: {
              model: Pengguna
            }
          },
          {model: JadwalPiket,
          include: {
            model: Pengguna,
            as: 'nik_pic_piket'
          }},
        ]
      },
      {model: Pengguna
      }
    ]
  })
  .then(bukti => {
    res.render('./fasilitator/tindaklanjutruangdetail', {
      rooms: bukti,
      pageTitle: 'Tindak Lanjut Ruang',
      path: '/buktiruang'
    });

  })
  .catch(err => {
      console.log(err);
  });

};

exports.postTindakLanutRuangFasilitator= (req,res, next) => {

  const id = req.body.buktiId;
  const deskripsi = req.body.deskripsi;
  const image = req.files.image;

  Bukti_temuan.findByPk(id)
  .then(bukti => {
    const nowTanggal = moment().format('DD-MM-YYYY');

    if( bukti.deadline !== 'Invalid date'){
      if ( nowTanggal <= bukti.deadline ){
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
      }else {
        if (image != null ){
            const imgUrl = image[0].path;
            bukti.deskripsi_sesudah=deskripsi;
            bukti.fotosesudah = imgUrl;
            bukti.tinjak_lanjut = 3;
            return bukti.save();

            }else {
              bukti.deskripsi_sesudah = deskripsi;
              bukti.tinjak_lanjut = 3;
              return bukti.save();
            }
      }
    }else{
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
    }

  })
  .then( () => {
      res.redirect('/fasilitator/tindaklanjut/ruang/detail/'+id);

  })
  .catch(err => {
      console.log(err);
  });

};
