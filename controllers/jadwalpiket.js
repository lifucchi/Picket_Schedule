const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');

const moment = require('moment');
const Ruang = require('../models/ruang');


// admin
exports.getDataJadwalPiket = (req,res, next) => {
  JadwalPiket.findAll({
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket',
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil',
    }
  ]
  })
  .then(jadwalpiket => {

    Pengguna.findAll()
    .then(user => {
      return res.render('./admin/jadwalpiket', {
        schedules: jadwalpiket,
        users:user,
        pageTitle: 'Jadwal Piket',
        path: '/jadwalpiket'
      });
    })
  })
  .catch(err => console.log(err));
};

exports.getFormJadwalPiket = (req,res,next) => {

  Pengguna.findAll()
  .then( pengguna =>{
    res.render("./admin/jadwalpiket-form", {
      users: pengguna,
      pageTitle: 'Jadwal Piket',
      jenis: 'Tambah',
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
     // console.log(ada);
     if(ada.length === 0){
         return JadwalPiket.bulkCreate([
            {tanggal:tanggal,nikpicfasil:pic_fasil_1, nikpicpiket:pic_piket_1},
            {tanggal:tanggal,nikpicfasil:pic_fasil_2, nikpicpiket:pic_piket_2}
          ],
        ).then( result => {

            var penilaian = [];

            Meja
            .findAll({
              include: [{
                    model: Pengguna,
                }]
              })
            .then(meja => {

              for (var j = 0; j < meja.length; j++){
                if ( meja[j].dataValues.pengguna.level === 1){
                  var penObj = {
                    bobotmeja: 0,
                    persetujuanpicpiket: 2,
                    mejaId: meja[j].dataValues.id,
                    jadwalPiketId: result[0].dataValues.id
                  };
                  penilaian.push(penObj);
                }
                else if ( meja[j].dataValues.pengguna.level === 2){
                  var penObj = {
                    bobotmeja: 0,
                    persetujuanpicpiket: 2,
                    mejaId: meja[j].dataValues.id,
                    jadwalPiketId: result[1].dataValues.id
                  };
                  penilaian.push(penObj);
                }
              }

              Penilaian_meja
              .bulkCreate(penilaian)

              Ruang.findAll({
                include: [{
                      model: Pengguna,
                  }]
                }).then( ruang => {
                var penilaianruang = [];

                for (var j = 0; j < ruang.length; j++){
                  if ( ruang[j].dataValues.pengguna.level === 1){
                    var penObj = {
                      bobotruang: 0,
                      persetujuanpicpiket: 2,
                      ruangId: ruang[j].dataValues.id,
                      jadwalPiketId: result[0].dataValues.id
                    };
                    penilaianruang.push(penObj);
                  }
                  else if ( ruang[j].dataValues.pengguna.level === 2){
                    var penObj = {
                      bobotruang: 0,
                      persetujuanpicpiket: 2,
                      ruangId: ruang[j].dataValues.id,
                      jadwalPiketId: result[1].dataValues.id
                    };
                    penilaianruang.push(penObj);
                  }
                }

                Penilaian_ruang
                .bulkCreate(penilaianruang)

              })
            });

          })
          .then( res.redirect('/admin/jadwalpiket') );
     }
     console.log("tanggal ada");
     return res.redirect('/admin/jadwalpiket/add')

   })
  .catch(err => console.log(err));
};

exports.postDeleteJadwalPiket = ( req,res, next) => {
  const id = req.body.penggunaId;
  JadwalPiket.findByPk(id)
    .then(jadwalpiket => {
      return jadwalpiket.destroy();
    })
    .then(result => {
      console.log('DESTROYED JADWAL');
      res.redirect('/admin/JadwalPiket');
    })
    .catch(err => console.log(err));

};

exports.postEditJadwal = ( req,res, next) => {
  const id = req.body.id;
  const fasil_edit = req.body.fasil_edit;
  const pic_edit = req.body.pic_edit;
  const tanggal_edit = req.body.tanggal_edit;

  // console.log(pemilik);
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

  // req.user
  // .getPemilikJadwal({
  //   include: [{
  //     model: Pengguna,
  //     as: 'nik_pic_piket',
  //   },
  //   {
  //     model: Pengguna,
  //     as: 'nik_pic_fasil',
  //   }
  // ]
  // })
  // .then(jadwalpiket => {
  //   res.render('./anggota/jadwalpiket', {
  //     schedules: jadwalpiket,
  //     pageTitle: 'Jadwal Piket',
  //     path: '/jadwalpiket'
  //   });
  // })
  // .catch(err => console.log(err));
  //
  //


  JadwalPiket.findAll({
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket',
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil',
    }
  ]
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

  req.user
  .getPemilikJadwal({
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket',
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil',
    }
  ]
  })
  .then(jadwalpiket => {
    res.render('./anggota/checklistpiket', {
      schedules: jadwalpiket,
      pageTitle: 'Jadwal Piket',
      path: '/checklistpiket'
    });
  })
  .catch(err => console.log(err));

  // JadwalPiket.findAll({
  //   include: [{
  //     model: Pengguna,
  //     as: 'nik_pic_piket',
  //   },
  //   {
  //     model: Pengguna,
  //     as: 'nik_pic_fasil',
  //   }
  // ]
  // })
  // .then(jadwalpiket => {
  //
  //   Pengguna.findAll()
  //   .then(user => {
  //     return res.render('./anggota/checklistpiket', {
  //       schedules: jadwalpiket,
  //       users:user,
  //       pageTitle: 'Jadwal Piket',
  //       path: '/jadwalpiket'
  //     });
  //   })
  // })
  // .catch(err => console.log(err));

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
    })

    const sudahruang = Penilaian_ruang.count(
      { where: { JadwalPiketId: id,
      persetujuanpicpiket: 1 },
      include: [{
        model: JadwalPiket,
      },
    ]
    })
    const belummeja = Penilaian_meja.count(
      { where: { JadwalPiketId: id ,
      persetujuanpicpiket: 0},
      include: [{
        model: JadwalPiket,
      },
    ]
    })

    const belumruang = Penilaian_ruang.count(
      { where: { JadwalPiketId: id,
        persetujuanpicpiket: 0},
      include: [{
        model: JadwalPiket,
      },
    ]
    })


    Promise
        .all([sudahhmeja, sudahruang, belummeja, belumruang ])
        .then(count => {
            console.log('**********COMPLETE RESULTS****************');
            console.log(count[0]); // user profile
            console.log(count[1]); // all reports
            console.log(count[2]); // report details
            console.log(count[3]); // report details

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
    console.log('UPDATED NILAI!');
    res.redirect('/anggota/checklistpiket/detail/'+id);
  })
  .catch(err => console.log(err));


};



// Fasilitator

exports.getLaporan = (req,res) => {
  // res.send('<h1>hello admin</h1>')
  console.log("pegawai nik ADALAH");


  JadwalPiket.findAll({
    where: {nikpicfasil: req.user.nik},
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket',
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil',

    }
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
      as: 'nik_pic_piket',
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil',
    },
  ]
});

const penilaianmeja = Penilaian_meja.findByPk(id)
const penilaianruang = Penilaian_ruang.findByPk(id)


Promise
    .all([jadwalPiket, penilaianmeja, penilaianruang])
    .then(piket => {
        console.log('**********COMPLETE RESULTS****************');
        console.log(piket[0]); // user profile
        console.log(piket[1]); // all reports
        console.log(piket[2]); // report details
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
    // penilaian.rekam_check =  moment();
    return penilaian.save();
  })
  .then(result => {
    console.log('UPDATED NILAI!');
    res.redirect('/fasilitator/laporan/'+id);
  })
  .catch(err => console.log(err));


};
