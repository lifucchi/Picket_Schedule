const Ruang = require('../models/ruang');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_meja = require('../models/penilaian_meja');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const sequelize = require('../util/database');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const Meja = require('../models/meja');


// Admin
exports.getDataPenilaianMeja= (req,res, next) => {

  const meja = JadwalPiket.findAll(
    { where:{persetujuan_fasil: 1},
      include: [
    {
      model: Penilaian_meja,
      include : {
        model: Meja,
        include : {
          model: Pengguna,
        }
      }
    },
    {
      model: Pengguna,
      as: 'nik_pic_piket',
      where: { level: 1}
    }
  ]}
  );

  const meja2 = Penilaian_meja.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {persetujuan_fasil: 1},
          include : {
            model: Pengguna,
            as: 'nik_pic_piket',
          }
        },
        {
          model: Meja,
          include : {
            model: Pengguna,
          }
        }
      ]
    }
  );

  const meja3 = JadwalPiket.findAll(
    {where:{persetujuan_fasil: 1},
      include: [
        {
          model: Penilaian_meja,
          include : {
          model: Meja,
          include : {
            model: Pengguna,
          }
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
      .all([meja,meja2,meja3])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          console.log(hasil[0]);
          res.render('./admin/rekapitulasi-meja', {
            rooms: hasil[0],
            rooms2:hasil[1],
            rooms3:hasil[2],

            pageTitle: 'Skor Meja',
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });

};


exports.getDataFilterPenilaianMeja= (req,res, next) => {
  const bulanTahun = req.body.bulanTahun;
  console.log(bulanTahun);
  // console.log("edit");
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');

  console.log(tahun);
  console.log(bulan);
  let andOp = Op.and;


  const meja2 = Penilaian_meja.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
            {persetujuan_fasil:1}],
          },
          include : {
            model: Pengguna,
            as: 'nik_pic_piket',
          }
        },
        {
          model: Meja,
          include : {
            model: Pengguna,
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
    }
  );




  Promise
      .all([meja2])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          for(i = 0; i < hasil[0].length; i++){
            hasil[0][i].bobotmeja = parseFloat(hasil[0][i].bobotmeja).toFixed(2);
          }
          res.render('./admin/rekapitulasi-mejafilter', {
            rooms2: hasil[0],
            // rooms2:hasil[1],
            // rooms3:hasil[2],

            pageTitle: 'Skor Meja',
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });

};

exports.postDeletePenialaianMeja = ( req,res, next) => {
  const id = req.body.penilaianMejaId;
  console.log(id);
  Penilaian_meja.findByPk(id)
    .then(penilaianMeja => {
      return penilaianMeja.destroy();
    })
    .then(result => {
      console.log('DESTROYED PENGGUNA');
      res.redirect('/admin/skormeja');
    })
    .catch(err => console.log(err));

};
