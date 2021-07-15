const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const moment = require('moment');



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
          // {
          //   include: [{
          //     model: Pengguna,
          //     as: 'nik_pic_piket',
          //   }
          // ]
          // }
        ).then( result => {

            var penilaian = [];
            var penilaianruang = []

            Meja
            .findAll({
              include: [{
                    model: Pengguna,
                    // where: {level: 1}
                }]
              })
            .then(meja => {

            // const jadwal = JadwalPiket.findAll({
            //   include: [{
            //     model: Pengguna,
            //     as: 'nik_pic_piket',
            //   }
            // ]
            // })

            // console.log(result);

            // for (var i = 0; i < result.length; i++){
              // console.log("ini result");
              // console.log(result[i].dataValues.id);
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
            // }

              Penilaian_meja
              .bulkCreate(penilaian)
              .then( res.redirect('/admin/jadwalpiket') );

            });



            // result.addpenilaian_meja( { through: { selfGranted: false } });
            // console.log(result);
            // Meja.findAll().then(meja => {
            //   console.log("ini meja");
            //   console.log(meja);
            //
            //   Penilaian_meja.bulkCreate(meja, { through: { bobotmeja: '0', persetujuanpicpiket: '0' }});
            // })
          })
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
