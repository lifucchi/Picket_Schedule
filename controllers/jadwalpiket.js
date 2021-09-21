const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');
const moment = require('moment');
const Ruang = require('../models/ruang');
const sequelize = require('../util/database');
const readXlsxFile = require("read-excel-file/node");
const path = require('path');
const fs = require('fs');

// admin
exports.getDataJadwalPiket = (req,res, next) => {
  JadwalPiket.findAll({
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket'
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil'
    }
  ]
  })
  .then(jadwalpiket => {
    Pengguna.findAll()
    .then(user => {
        res.render('./admin/jadwalpiket', {
        schedules: jadwalpiket,
        users:user,
        pageTitle: 'Jadwal Piket',
        path: '/jadwalpiket'
      });
    });
  })
  .catch(err => console.log(err));
};

exports.getFormJadwalPiket = (req,res,next) => {
  Pengguna.findAll()
  .then( pengguna =>{
    res.render("./admin/jadwalpiket-form", {
      users: pengguna,
      pageTitle: 'Jadwal Piket',
      jenis: 'Tambah'
    });
  })
  .catch(err => console.log(err));
};

exports.postAddDataJadwalPiket = (req,res,next) => {
  const tanggal = req.body.tanggal;
  const pic_piket_1 = req.body.pic_piket_1;
  const pic_fasil_1 = req.body.pic_fasil_1;
  const pic_piket_2 = req.body.pic_piket_2;
  const pic_fasil_2 = req.body.pic_fasil_2;

  JadwalPiket.findAll({
    where:{
      tanggal: tanggal
   }}).then( ada => {
     if(ada.length === 0){
         return JadwalPiket.bulkCreate([
            {tanggal:tanggal,nikpicfasil:pic_fasil_1, nikpicpiket:pic_piket_1},
            {tanggal:tanggal,nikpicfasil:pic_fasil_2, nikpicpiket:pic_piket_2}
          ]
        ).then( result => {
            var penilaian = [];
            Meja
            .findAll({
              include: [{
                    model: Pengguna,
                }]
              })
            .then(meja => {
              var penObj ={};
              for (var j = 0; j < meja.length; j++){
                if ( meja[j].dataValues.pengguna.level === 1){
                  penObj = {
                    bobotmeja: 0,
                    persetujuanpicpiket: 2,
                    mejaId: meja[j].dataValues.id,
                    jadwalPiketId: result[0].dataValues.id
                  };
                  penilaian.push(penObj);
                }
                else if ( meja[j].dataValues.pengguna.level === 2){
                  penObj = {
                    bobotmeja: 0,
                    persetujuanpicpiket: 2,
                    mejaId: meja[j].dataValues.id,
                    jadwalPiketId: result[1].dataValues.id
                  };
                  penilaian.push(penObj);
                }
              }

              Penilaian_meja
              .bulkCreate(penilaian);

              Ruang.findAll({
                include: [{
                      model: Pengguna,
                  }]
                }).then( ruang => {
                var penilaianruang = [];
                var penObj ={};

                for (var j = 0; j < ruang.length; j++){
                  if ( ruang[j].dataValues.pengguna.level === 1){
                    penObj = {
                      bobotruang: 0,
                      persetujuanpicpiket: 2,
                      ruangId: ruang[j].dataValues.id,
                      jadwalPiketId: result[0].dataValues.id
                    };
                    penilaianruang.push(penObj);
                  }
                  else if ( ruang[j].dataValues.pengguna.level === 2){
                    penObj = {
                      bobotruang: 0,
                      persetujuanpicpiket: 2,
                      ruangId: ruang[j].dataValues.id,
                      jadwalPiketId: result[1].dataValues.id
                    };
                    penilaianruang.push(penObj);
                  }
                }

                Penilaian_ruang
                .bulkCreate(penilaianruang);

              });
            });

          })
          .then( res.redirect('/admin/jadwalpiket') );
     }

     res.redirect('/admin/jadwalpiket/add');

   })
  .catch(err => console.log(err));
};


exports.postImportJadwal = ( req,res, next) => {
  const excelFile = req.files.excel[0].path;
  const oldPath = path.join(__dirname, "..", excelFile);

  readXlsxFile(oldPath)
  .then((rows) => {

     rows.shift();
     let jadwals1 = [];
     let jadwals2 = [];

     rows.forEach((row) => {
      let jadwalSatu = {
        tanggal: row[0],
        nikpicpiket: row[1],
        nikpicfasil: row[2],
      };
      let jadwalDua = {
        tanggal: row[0],
        nikpicpiket: row[3],
        nikpicfasil: row[4],
      };
      jadwals1.push(jadwalSatu);
      jadwals2.push(jadwalDua);

    });

    JadwalPiket.bulkCreate(jadwals1)
    .then( results => {
      var penilaian = [];

      Meja
      .findAll({
        include: [{
              model: Pengguna,
              where: {level: 1},
          }]
        })
      .then(meja => {

        results.forEach((result) => {
          console.log("inimeja 1");
          for (var j = 0; j < meja.length; j++){
              var penObj = {
                bobotmeja: 0,
                persetujuanpicpiket: 2,
                mejaId: meja[j].dataValues.id,
                jadwalPiketId: result.dataValues.id
              };
              penilaian.push(penObj);
          }
        });
          Penilaian_meja
          .bulkCreate(penilaian);

      });
      Ruang.findAll({
        include: [{
              model: Pengguna,
              where: {level: 1},

          }]
        })
        .then( ruang => {
        var penilaianruang = [];
        var penObj = {};
        results.forEach((result) => {
        for (var j = 0; j < ruang.length; j++){
            penObj = {
              bobotruang: 0,
              persetujuanpicpiket: 2,
              ruangId: ruang[j].dataValues.id,
              jadwalPiketId: result.dataValues.id
            };
            penilaianruang.push(penObj);
        }
      });

        Penilaian_ruang
        .bulkCreate(penilaianruang);

      }).catch(err => console.log(err));
    })
    .catch(err => console.log(err));

// LEVEL 2
    JadwalPiket.bulkCreate(jadwals2)
    .then( results => {
      var penilaian = [];

      Meja
      .findAll({
        include: [{
              model: Pengguna,
              where: {level: 2},
          }]
        })
      .then(meja => {
        var penObj = {};
        results.forEach((result) => {
          for (var j = 0; j < meja.length; j++){
              var penObj = {
                bobotmeja: 0,
                persetujuanpicpiket: 2,
                mejaId: meja[j].dataValues.id,
                jadwalPiketId: result.dataValues.id
              };
              penilaian.push(penObj);
          }
          console.log(penilaian.length);
        });


        Penilaian_meja
        .bulkCreate(penilaian);
      });

      Ruang.findAll({
        include: [{
              model: Pengguna,
              where: {level: 2}
          }]
        }).then( ruang => {
        var penilaianruang = [];
        var penObj = {};
        results.forEach((result) => {
          for (var j = 0; j < ruang.length; j++){
            penObj = {
              bobotruang: 0,
              persetujuanpicpiket: 2,
              ruangId: ruang[j].dataValues.id,
              jadwalPiketId: result.dataValues.id
            };
            penilaianruang.push(penObj);
        }
      });
        Penilaian_ruang
        .bulkCreate(penilaianruang);
      }).catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  })
  .then( () => {
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    return res.redirect('/admin/jadwalpiket');
    }
  ).catch(err => console.log(err));
};

exports.postDeleteJadwalPiket = ( req,res, next) => {
  const id = req.body.penggunaId;
  JadwalPiket.findByPk(id)
    .then(jadwalpiket => {
      return jadwalpiket.destroy();
    })
    .then(result => {
      res.redirect('/admin/JadwalPiket');
    })
    .catch(err => console.log(err));
};

exports.postEditJadwal = ( req,res, next) => {
  const id = req.body.id;
  const fasil_edit = req.body.fasil_edit;
  const pic_edit = req.body.pic_edit;
  const tanggal_edit = req.body.tanggal_edit;

  JadwalPiket.findByPk(id)
    .then(jadwal => {
      jadwal.tanggal = tanggal_edit;
      jadwal.nikpicfasil = fasil_edit;
      jadwal.nikpicpiket = pic_edit;
      return jadwal.save();
    })
    .then(result => {
      console.log('UPDATED Jadlwal!');
      res.redirect('/admin/jadwalpiket');
    })
    .catch(err => console.log(err));
};

// ANGGOTA
exports.getJadwalPiketAnggota = (req,res, next) => {

  JadwalPiket.findAll({
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket'
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil'
    }
  ],
    order: [
        ['tanggal', 'DESC']
    ],
  })
  .then(jadwalpiket => {
    res.render('./anggota/jadwalpiket', {
      schedules: jadwalpiket,
      pageTitle: 'Jadwal Piket',
      path: '/jadwalpiket'
    });
  })
  .catch(err => console.log(err));
};


exports.getChecklistPiket = (req,res, next) => {

  // req.user
  // .getPemilikJadwal({
  //   include: [{
  //     model: Pengguna,
  //     as: 'nik_pic_piket'
  //   },
  //   {
  //     model: Pengguna,
  //     as: 'nik_pic_fasil'
  //   }
  // ],
  // order: [
  //     ['tanggal', 'DESC']
  // ],
  // })

  JadwalPiket.findAll({
    where: {
      nikpicpiket: req.session.user.nik,
    },
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket',
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil'
    }
  ],
  order: [
      ['tanggal', 'DESC']
  ],
  })
  .then(jadwalpiket => {

    console.log(jadwalpiket);
    res.render('./anggota/checklistpiket', {
      schedules: jadwalpiket,
      pageTitle: 'Jadwal Piket',
      path: '/checklistpiket'
    });
  })
  .catch(err => console.log(err));

};


exports.getDataChecklistPiketDetail = (req,res, next) => {
const id = req.params.piketId;
  JadwalPiket.findByPk(id)
  .then( piket => {
    const pikets = piket;
    const sudahhmeja = Penilaian_meja.count(
      { where: { JadwalPiketId: id,
      persetujuanpicpiket: 1 },
      include: [{
        model: JadwalPiket,
      },
    ]
  });

    const sudahruang = Penilaian_ruang.count(
      { where: { JadwalPiketId: id,
      persetujuanpicpiket: 1 },
      include: [{
        model: JadwalPiket,
      },
    ]
  });
    const belummeja = Penilaian_meja.count(
      { where: { JadwalPiketId: id ,
      persetujuanpicpiket: 2},
      include: [{
        model: JadwalPiket,
      },
    ]
  });

    const belumruang = Penilaian_ruang.count(
      { where: { JadwalPiketId: id,
        persetujuanpicpiket: 2},
      include: [{
        model: JadwalPiket,
      },
    ]
  });

    Promise
        .all([sudahhmeja, sudahruang, belummeja, belumruang ])
        .then(count => {
            res.render('./anggota/checklistpiketdetail', {
              piket: piket,
              pageTitle: 'Checklist Piket',
              path: '/checklistpiketada',
              count:count
            });
        })
        .catch(err => {
            console.log('**********ERROR RESULT****************');
            console.log(err);
        });
  })
  .catch(err => console.log(err));

};

exports.postCheckPic = (req,res, next) => {
  const id = req.body.check;
  JadwalPiket
  .findByPk(id)
  .then( penilaian => {
    const nowTanggal = moment().format('YYYY-MM-DD');

    if ( nowTanggal === penilaian.tanggal ){
      penilaian.status_piket = 1;
    }else {
      penilaian.status_piket = 2;
    }
    penilaian.rekam_check =  moment();
    return penilaian.save();
  })
  .then(result => {
    res.redirect('/anggota/checklistpiket/detail/'+id);
  })
  .catch(err => console.log(err));
};



// Fasilitator

exports.getLaporan = (req,res) => {

  JadwalPiket.findAll({
    where: {nikpicfasil: req.user.nik},
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket'
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil'
    }
  ],
  order: [
      ['tanggal', 'DESC']
  ]
})
.then( fasilitator => {
  res.render('./fasilitator/laporan', {
    schedules: fasilitator,
    pageTitle: 'Laporan',
    path: '/'
  });
})
.catch(err => console.log(err));
};

exports.getDataLaporanDetail = (req,res, next) => {
const id = req.params.piketId;

  const jadwalPiket = JadwalPiket.findByPk(id, {
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket'
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil'
    },
  ]
});

const penilaianmeja = Penilaian_meja.findAll({
 where: { JadwalPiketId: id,}
  ,
  include: [
  {
    model: Meja,
    include : {
      model: Pengguna
    }
  }
]
}

)
const penilaianruang = Penilaian_ruang.findAll(
  {
    where: { JadwalPiketId: id},
    include: [
    {
      model: Ruang,
      include : {
        model: Pengguna
      }
    }
  ]
}
)

const totalskormoja = Penilaian_meja.sum('bobotmeja', {where: { JadwalPiketId: id,}})
const totalskorruang = Penilaian_ruang.findAll(
  {
    where: { JadwalPiketId: id},
      include: [
      {
        model: Ruang
      }
    ],
    attributes: [
      'bobotruang',
      'JadwalPiketId',
      [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
    ],
    group : ['JadwalPiketId']
  }
)

Promise
    .all([jadwalPiket, penilaianmeja, penilaianruang, totalskormoja, totalskorruang])
    .then(piket => {
        res.render('./fasilitator/laporandetail', {
          piket: piket,
          pageTitle: 'Laporan',
          path: '/laporanada'
        });
    })
    .catch(err => {
        console.log('**********ERROR RESULT****************');
        console.log(err);
    });
};

exports.postCheckFasil = (req,res, next) => {
  const id = req.body.check;
  JadwalPiket
  .findByPk(id)
  .then( penilaian => {
    const nowTanggal = moment().format('YYYY-MM-DD');
    if ( nowTanggal === penilaian.tanggal ){
      penilaian.persetujuan_fasil = 1;
    }else {
      penilaian.persetujuan_fasil = 2;
    }
    return penilaian.save();
  })
  .then(result => {
    console.log('UPDATED NILAI!');
    res.redirect('/fasilitator/laporan/'+id);
  })
  .catch(err => console.log(err));
};

exports.getContohInput = ( req,res, next) => {
    res.render('./admin/contohinput', {
      pageTitle: 'COntoh Input'
    });
};
