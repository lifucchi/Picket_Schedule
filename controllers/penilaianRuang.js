const Ruang = require('../models/ruang');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_ruang = require('../models/penilaian_ruang');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const sequelize = require('../util/database');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
// let andOp = Op.and
// const { Op } = require("sequelize");

// Admin
exports.getDataPenilaianRuang= (req,res, next) => {

  const ruang = JadwalPiket.findAll(
    { where:{persetujuan_fasil: 1},
      include: [
    {
      model: Penilaian_ruang,
      include : {
        model: Ruang
      }
    },
    {
      model: Pengguna,
      as: 'nik_pic_piket',
      where: { level: 1}
    }
  ]}
  );

  const ruang2 = Penilaian_ruang.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {persetujuan_fasil: 1},
          include : [{
            model: Pengguna,
            as: 'nik_pic_piket'
          }]
        },
        {
          model: Ruang
        }
      ]
    }
  );

  const ruang3 = JadwalPiket.findAll(
    {where:{persetujuan_fasil: 1},
      include: [
        {
          model: Penilaian_ruang,
          include : {
          model: Ruang
        }
        },
        {
          model: Pengguna,
          as: 'nik_pic_piket',
          where: { level: 2}
        }
      ]
    }
  );


  Promise
      .all([ruang,ruang2,ruang3])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          // console.log(hasil[1]);
          res.render('./admin/rekapitulasi-ruang', {
            rooms: hasil[0],
            rooms2:hasil[1],
            rooms3:hasil[2],

            pageTitle: 'Skor Ruang',
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });

};
exports.getDataFilterPenilaianRuang= (req,res, next) => {
  const bulanTahun = req.body.bulanTahun;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');

  let andOp = Op.and;
  const ruang = JadwalPiket.findAll(
    {
      where: {
        [Op.and]:
        [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
        {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
        {persetujuan_fasil:1}]

      },
      include: [
        {
          model: Penilaian_ruang,
          include : {
          model: Ruang
        }
        },
        {
          model: Pengguna,
          as: 'nik_pic_piket',
          where: { level: 1}
        }
      ]
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
                {persetujuan_fasil:1}]
              },
          include : {
            model: Pengguna,
            as: 'nik_pic_piket'
          }
        },
        {
          model: Ruang
        }
      ]
    }
  );

  const ruang3 = JadwalPiket.findAll(
    {
      where: {
        [Op.and]:
        [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
        {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
        {persetujuan_fasil:1}]

      },
      include: [
        {
          model: Penilaian_ruang,
          include : {
          model: Ruang
        }
        },
        {
          model: Pengguna,
          as: 'nik_pic_piket',
          where: { level: 2}
        }
      ]
    }
  );


  Promise
      .all([ruang, ruang2, ruang3])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          res.render('./admin/rekapitulasi-ruang', {
            rooms: hasil[0],
            rooms2: hasil[1],
            rooms3: hasil[2],
            pageTitle: 'Skor Ruang',
            bulanTahun: bulanTahun,
            filter: 'filter'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });

};

exports.postDeletePenialaianRuang = ( req,res, next) => {
  const id = req.body.penilaianRuangId;
  console.log(id);
  Penilaian_ruang.findByPk(id)
    .then(penilaianRuang => {
      return penilaianRuang.destroy();
    })
    .then(result => {
      console.log('DESTROYED PENGGUNA');
      res.redirect('/admin/skorruang');
    })
    .catch(err => console.log(err));

};
