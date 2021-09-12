const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const moment = require('moment');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');

const Ruang = require('../models/ruang');
const sequelize = require('../util/database')
const { Op } = require("sequelize");;

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
  var prevMonth = moment(nowTanggal).subtract(1, 'months').endOf('month').format('MM');
  const tahun = moment(nowTanggal).format('YYYY');

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
        include: [
          [sequelize.literal('SUM(bobotmeja) / COUNT(bobotmeja)'), 'bobotmeja']

        ]},
      group : ['penggunaNik'],
      order: [
          [[sequelize.literal('bobotmeja'), 'DESC']],
      ],
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
        include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
      group : ['jadwalPiketId'],
      order: [
            [[sequelize.literal('bobotruang'), 'DESC']],
      ],
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
      include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
      group : ['jadwalPiketId'],
      order: [
            [[sequelize.literal('bobotruang'), 'DESC']],
      ],
  }
  )

  Promise
      .all([mejaTerbaik,lantaiSatuTerbaik, lantaiDuaTerbaik])
      .then(count => {
          console.log('**********COMPLETE RESULTS****************');

;         count[0][0].bobotmeja = parseFloat(count[0][0].bobotmeja).toFixed(2);
          // sum all
          let lantaiSatu = 0;
          for(i = 0; i < count[1].length; i++){
            lantaiSatu = parseFloat(lantaiSatu) + parseFloat(count[1][i].bobotruang);
          }
          lantaiSatu = parseFloat(lantaiSatu) / parseFloat(count[1].length)
          let lantaiDua = 0;
          for(i = 0; i < count[2].length; i++){
            lantaiDua = parseFloat(lantaiDua) + parseFloat(count[2][i].bobotruang);
          }
          lantaiDua = parseFloat(lantaiDua) / parseFloat(count[2].length)
          let lantaiTerbaik = [];
          if ( lantaiSatu > lantaiDua ){
            lantaiTerbaik[0] = lantaiSatu.toFixed(2);
            lantaiTerbaik[1] = 1;
          } else{
            lantaiTerbaik[0] = lantaiDua.toFixed(2);
            lantaiTerbaik[1] = 2;
          }

          global.mejaTerbaik = count[0][0];
          global.lantaiTerbaik = lantaiTerbaik;


          res.render('./anggota/dashboard', {
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
