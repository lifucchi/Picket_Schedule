const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');

const moment = require('moment');
const Ruang = require('../models/ruang');
const sequelize = require('../util/database');

var Sequelize = require('sequelize')
var Op = Sequelize.Op

exports.getDataRekapitulasiRuang = (req,res) => {
  // const test = moment().day("Monday").year(year).week(week).toDate();
  const begin = moment('2021-07-01').startOf('week').isoWeekday(4);
  const test2 = moment().startOf('week').isoWeekday(1).format('YYYY-MM-DD hh:mm');
  const endofweek  = moment().endOf('week').isoWeekday(5).format('YYYY-MM-DD hh:mm');

  let currentDate = moment();
  let weekStart = currentDate.clone().startOf('week').isoWeekday(1);
  let weekEnd = currentDate.clone().endOf('week').isoWeekday(5);
  var tanggal = moment();
  // var monday = now.clone().weekday(1);
  // var friday = now.clone().weekday(5);
  // var isNowWeekday = now.isBetween(monday, friday, null, '[]');

  const tanggal2 = moment(tanggal, "DD-MM-YYYY");
  // var tanggal2 = moment();
  // console.log(tanggal);
  // console.log(tanggal2);
  // var now = moment();
  var monday = tanggal2.clone().weekday(1).format("YYYY-MM-DD");
  var friday = tanggal2.clone().weekday(5).format("YYYY-MM-DD");


      // Promise
      //     .all([ruang2])
      //     .then(hasil => {
      console.log('**********COMPLETE RESULTS****************');
      // console.log(hasil[1]);
      const hasil = []
      res.render('./anggota/rekapitulasi-ruang', {
        pageTitle: 'Rekapitulasi',
        monday: monday,
        friday: friday,

      })

          // })
          // .catch(err => {
          //     console.log('**********ERROR RESULT****************');
          //     console.log(err);
          // });

};


exports.getDataRekapitulasiRuangFilterMingguan = (req,res) => {

  const tanggal = req.body.tanggal;
  const tanggal2 = moment(tanggal, "DD-MM-YYYY");
  var monday = tanggal2.clone().weekday(1).format("YYYY-MM-DD");
  var friday = tanggal2.clone().weekday(5).format("YYYY-MM-DD");

  const ruang1 = Penilaian_ruang.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            persetujuan_fasil:2,
            tanggal: {
              [Op.between]: [monday, friday]
            }
          },
          include : [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: { level: 1}
          }]
        },
        {
          model: Ruang
        }
      ],
      attributes: {
      include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
      group : ['jadwalPiketId'],
    }
  );

  const ruang2 = Penilaian_ruang.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            persetujuan_fasil:2,
            tanggal: {
              [Op.between]: [monday, friday]
            }
          },
          include : [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: { level: 2}
          }]
        },
        {
          model: Ruang
        }
      ],
      attributes: {
      include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
      group : ['jadwalPiketId'],
    }
  );

      Promise
          .all([ruang1, ruang2])
          .then(hasil => {
              console.log('**********COMPLETE RESULTS****************');
              res.render('./anggota/rekapitulasi-ruang', {
                pageTitle: 'Rekapitulasi',
                path: '/mingguan',
                rooms1: hasil[0],
                rooms2: hasil[1],
                monday: monday,
                friday: friday,
              })

          })
          .catch(err => {
              console.log('**********ERROR RESULT****************');
              console.log(err);
          });

};

exports.getDataRekapitulasiRuangFilterBulanan = (req,res) => {

  const bulanTahun = req.body.tanggal;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');

  const ruang1 = Penilaian_ruang.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
            {persetujuan_fasil:2}],
          },
          include : [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: { level: 1}
          }]
        },
        {
          model: Ruang
        }
      ],
      attributes: {
      include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
      group : ['jadwalPiketId'],
    }
  );

  const ruang2 = Penilaian_ruang.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
            {persetujuan_fasil:2}],
          },
          include : [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: { level: 2}
          }]
        },
        {
          model: Ruang
        }
      ],
      attributes: {
      include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
      group : ['jadwalPiketId'],
    }
  );

      Promise
          .all([ruang1, ruang2])
          .then(hasil => {
              console.log('**********COMPLETE RESULTS****************');
              res.render('./anggota/rekapitulasi-ruang', {
                pageTitle: 'Rekapitulasi',
                path: '/bulanan',
                rooms1: hasil[0],
                rooms2: hasil[1],
                bulan: bulanTahun
              })

          })
          .catch(err => {
              console.log('**********ERROR RESULT****************');
              console.log(err);
          });

};

exports.getDataRekapitulasiRuangFilterTahunan = (req,res) => {

  const bulanTahun = req.body.tanggal;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');

  const ruang1 = Penilaian_ruang.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {persetujuan_fasil:2}],
          },
          include : [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: { level: 1}
          }]
        },
        {
          model: Ruang
        }
      ],
      attributes: {
      include: [
          [sequelize.fn('MONTH', sequelize.col('tanggal')), 'bulan'],
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
        group: [sequelize.fn('MONTH', sequelize.col('tanggal')), 'bulan']
    }
  );

  const ruang2 = Penilaian_ruang.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {persetujuan_fasil:2}],
          },
          include : [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: { level: 2}
          }]
        },
        {
          model: Ruang
        }
      ],
      attributes: {
      include: [
          [sequelize.fn('MONTH', sequelize.col('tanggal')), 'bulan'],
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang'],
        ]},
        group: [sequelize.fn('MONTH', sequelize.col('tanggal')), 'bulan']
    }
  );

      Promise
          .all([ruang1, ruang2])
          .then(hasil => {
              console.log('**********COMPLETE RESULTS****************');

              // console.log(hasil[1][0]);

              console.log("==========");
              // console.log(hasil[1]);
              res.render('./anggota/rekapitulasi-ruang', {
                pageTitle: 'Rekapitulasi',
                path: '/tahunan',
                rooms1: hasil[0],
                rooms2: hasil[1],
                tahun: tahun,
              })

          })
          .catch(err => {
              console.log('**********ERROR RESULT****************');
              console.log(err);
          });

};
