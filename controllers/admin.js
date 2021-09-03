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
   var prevMonth = moment(nowTanggal).subtract(1, 'months').endOf('month').format('MM');
   const tahun = moment(nowTanggal).format('YYYY');

   console.log(tahun);

  const mejaTerbaik = Penilaian_meja.findAll(
    {
        include: [
        {
          model: Meja,
          include: [{
            model: Pengguna,
          }],
        },
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), prevMonth)},
            {persetujuan_fasil:2}],

          }
        }
      ],
      attributes: {
        // 'bobotmeja',
        // 'meja.JadwalPiketId',
        // 'meja.jadwal_piket.tanggal',
        // "skor",
        include: [
          [sequelize.literal('SUM(bobotmeja) / COUNT(bobotmeja)'), 'bobotmeja']
          // [sequelize.fn('SUM', sequelize.col('bobotmeja')), 'bobotmeja'],
        ]},
      group : ['penggunaNik'],
      order: [
          ['bobotmeja', 'DESC'],
      ],
      // raw: true,
    }
  )

  const lantaiSatuTerbaik = Penilaian_ruang.findAll(
    {
        include: [
        {
          model: Ruang,
        },
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), prevMonth)},
            {persetujuan_fasil:2}],
          },
          include: [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: {level: 1}
          },
          {
            model: Pengguna,
            as: 'nik_pic_fasil',

          }
        ]
        }
      ],
      attributes: {
        // 'bobotmeja',
        // 'meja.JadwalPiketId',
        // 'meja.jadwal_piket.tanggal',
        // "skor",
        include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
          // [sequelize.fn('SUM', sequelize.col('bobotruang')), 'skor'],
        ]},
      group : ['jadwalPiketId', 'jadwal_piket.nik_pic_piket.level'],
      order: [
          ['bobotruang', 'DESC'],
      ],
      // raw: true,
    }
  )

  const lantaiDuaTerbaik = Penilaian_ruang.findAll(
    {
        include: [
        {
          model: Ruang,
        },
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), prevMonth)},
            {persetujuan_fasil:2}],
          },
          include: [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: {level: 2}
          },
          {
            model: Pengguna,
            as: 'nik_pic_fasil',

          }
        ]
        }
      ],
      attributes: {
        // 'bobotmeja',
        // 'meja.JadwalPiketId',
        // 'meja.jadwal_piket.tanggal',
        // "skor",
        include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
          // [sequelize.fn('SUM', sequelize.col('bobotruang')), 'skor'],
        ]},
      group : ['jadwalPiketId', 'jadwal_piket.nik_pic_piket.level'],
      order: [
          ['bobotruang', 'DESC'],
      ],
      // raw: true,
    }
  )


  Promise
      .all([mejaTerbaik,lantaiSatuTerbaik, lantaiDuaTerbaik])
      .then(count => {
          console.log('**********COMPLETE RESULTS****************');
          for(i = 0; i < count[0].length; i++){
;            count[0][i].bobotmeja = parseFloat(count[0][i].bobotmeja).toFixed(2);
          }
          console.log(count[0]);
          console.log(count[0].length);
          // sum all
          let lantaiSatu = 0;
          for(i = 0; i < count[1].length; i++){
            // console.log("putaran" + i);
            // console.log(count[1][i].bobotruang);
            // console.log(count[1][i].jadwal_piket.nik_pic_piket.level);
            lantaiSatu = parseFloat(lantaiSatu) + parseFloat(count[1][i].bobotruang);
            // console.log(lantaiSatu);
          }
          lantaiSatu = parseFloat(lantaiSatu) / parseFloat(count[1].length)
          // console.log(lantaiSatu);
          let lantaiDua = 0;
          for(i = 0; i < count[2].length; i++){
            // console.log("putaran" + i);
            // console.log(count[2][i].bobotruang);
            // console.log(count[2][i].jadwal_piket.nik_pic_piket.level);
            lantaiDua = parseFloat(lantaiDua) + parseFloat(count[2][i].bobotruang);
            // console.log(lantaiDua);
          }
          lantaiDua = parseFloat(lantaiDua) / parseFloat(count[2].length)
          // console.log(lantaiDua);

          // mencari yang terbesar
          let lantaiTerbaik = [];
          if ( lantaiSatu > lantaiDua ){
            lantaiTerbaik[0] = lantaiSatu;
            lantaiTerbaik[1] = 1;
          } else{
            lantaiTerbaik[0] = lantaiDua;
            lantaiTerbaik[1] = 2;

          }



          res.render('./admin/admin', {
            pageTitle: 'Dashboard',
            path: '/',
            schedules: piket,
            tanggal : nowTanggal2,
            mejaTerbaik : count[0][0],
            lantaiTerbaik: lantaiTerbaik
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
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
