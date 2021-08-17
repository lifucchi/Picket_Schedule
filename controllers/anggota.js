const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const moment = require('moment');


exports.getDashboard = (req,res) => {
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
  res.render('./anggota/dashboard', {
    pageTitle: 'Dashboard',
    path: '/',
    schedules: piket,
    tanggal : nowTanggal2
  });
})

};
