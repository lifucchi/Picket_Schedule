const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const moment = require('moment');


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
  console.log(piket);
  res.render('./admin/admin', {
    pageTitle: 'Dashboard',
    path: '/',
    schedules: piket,
    tanggal : nowTanggal2
  });
})

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
