const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const moment = require('moment');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');

const Ruang = require('../models/ruang');
const sequelize = require('../util/database')
const { Op } = require("sequelize");;


exports.getAdminDashboard = (req,res) => {
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
}).then(piket => {
  const id = 5;

  const belumruang = Penilaian_ruang.count(
    { where: { JadwalPiketId: id,
      persetujuanpicpiket: 2},
    include: [{
      model: JadwalPiket,
    },
  ]
  })


  Promise
      .all([belumruang ])
      .then(count => {
          console.log('**********COMPLETE RESULTS****************');
          console.log(count[0]); // user profile

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


  res.render('./admin/admin', {
    pageTitle: 'Dashboard',
    path: '/',
    schedules: piket,
    tanggal : nowTanggal2
  });
}).catch(err => {
      console.log('**********ERROR RESULT****************');
      console.log(err);
      });

};


//
// exports.getDetailDataPengguna = ( req,res, next) => {
//   const nik = req.params.penggunaId;
//   Pengguna.findById(nik)
//   .then(([pengguna]) => {
//     console.log(pengguna[0]);
//     res.render('admin', {
//       pageTitle: 'Detail',
//       users: pengguna[0],
//       path: '/pengguna/detail'
//     });
//
//   }).catch(err => console.log(err));
// };
