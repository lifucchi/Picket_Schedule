const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');
const moment = require('moment');
const Ruang = require('../models/ruang');
const sequelize = require('../util/database');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

// RUANG
exports.getDataRekapitulasiRuang = (req,res) => {

  var tanggal = moment();
  const tanggal2 = moment(tanggal, "DD-MM-YYYY");
  var monday = tanggal2.clone().weekday(1).format("YYYY-MM-DD");
  var friday = tanggal2.clone().weekday(5).format("YYYY-MM-DD");

  console.log('**********COMPLETE RESULTS****************');

  if(req.session.user.peran === 'Anggota') {
    res.render('./anggota/rekapitulasi-ruang', {
      pageTitle: 'Rekapitulasi',
      monday: monday,
      friday: friday,
      path: '/'
    });

  }else if(req.session.user.peran === 'Fasilitator'){
    res.render('./fasilitator/rekapitulasi-ruang', {
      pageTitle: 'Rekapitulasi',
      monday: monday,
      friday: friday,
      path: '/'
    });
  }
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
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
        ]},
      group : ['jadwalPiketId']
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
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
        ]},
      group : ['jadwalPiketId']
    }
  );

      Promise
          .all([ruang1, ruang2])
          .then(hasil => {
            if(req.session.user.peran === 'Anggota') {
              res.render('./anggota/rekapitulasi-ruangfilter', {
                pageTitle: 'Rekapitulasi',
                path: '/mingguan',
                rooms1: hasil[0],
                rooms2: hasil[1],
                monday: monday,
                friday: friday,
              });

            }else if(req.session.user.peran === 'Fasilitator'){
              res.render('./fasilitator/rekapitulasi-ruangfilter', {
                pageTitle: 'Rekapitulasi',
                path: '/mingguan',
                rooms1: hasil[0],
                rooms2: hasil[1],
                monday: monday,
                friday: friday,
              });

            }


          })
          .catch(err => {
              console.log(err);
          });

};

exports.getDataRekapitulasiRuangFilterBulanan = (req,res) => {
  let bulanTahun = req.body.tanggal;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');

  bulanTahun = moment(bulanTahun, "MMM-YYYY").locale('id').format('MMMM YYYY');

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
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
        ]},
      group : ['jadwalPiketId']
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
            {persetujuan_fasil:2}]
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
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
        ]},
      group : ['jadwalPiketId']
    }
  );

      Promise
          .all([ruang1, ruang2])
          .then(hasil => {

              let lantaiSatu = 0;
              let lantaiDua = 0;




              if (hasil[0]){
                for(i = 0; i < hasil[0].length; i++){
                  lantaiSatu = parseFloat(lantaiSatu) + parseFloat(hasil[0][i].bobotruang);
                }
                lantaiSatu = parseFloat(lantaiSatu) / parseFloat(hasil[0].length);
              }

              if (hasil[1]){
                for(i = 0; i < hasil[1].length; i++){
                  lantaiDua = parseFloat(lantaiDua) + parseFloat(hasil[1][i].bobotruang);
                }
                lantaiDua = parseFloat(lantaiDua) / parseFloat(hasil[1].length);
              }

              let lantaiTerbaik = [];
              if ( lantaiSatu > lantaiDua ){
                lantaiTerbaik[0] = lantaiSatu.toFixed(2);
                lantaiTerbaik[1] = 1;
              } else if ( lantaiSatu < lantaiDua ){
                lantaiTerbaik[0] = lantaiDua.toFixed(2);
                lantaiTerbaik[1] = 2;
              }else{
                lantaiTerbaik[0] = 0;
                lantaiTerbaik[1] = 'belum ada';
              }

              // console.log("lanta 1");
              // console.log(lantaiSatu);
              // console.log(lantaiTerbaik[0]);
              // console.log("lanta 2");
              // console.log(lantaiDua);
              // console.log(lantaiTerbaik[1]);

              res.locals.lantaiTerbaik = lantaiTerbaik;

              if(req.session.user.peran === 'Anggota') {
                res.render('./anggota/rekapitulasi-ruangfilter', {
                  pageTitle: 'Rekapitulasi',
                  path: '/bulanan',
                  rooms1: hasil[0],
                  rooms2: hasil[1],
                  bulan: bulanTahun,
                  lantaiTerbaik: lantaiTerbaik
                });

              }else if(req.session.user.peran === 'Fasilitator'){
                res.render('./fasilitator/rekapitulasi-ruangfilter', {
                  pageTitle: 'Rekapitulasi',
                  path: '/bulanan',
                  rooms1: hasil[0],
                  rooms2: hasil[1],
                  bulan: bulanTahun,
                  lantaiTerbaik: lantaiTerbaik
                });

              }


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
            {persetujuan_fasil:2}]
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
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
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
            {persetujuan_fasil:2}]
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
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
        ]},
        group: [sequelize.fn('MONTH', sequelize.col('tanggal')), 'bulan']
    }
  );

      Promise
          .all([ruang1, ruang2])
          .then(hasil => {
              if(req.session.user.peran === 'Anggota') {
                res.render('./anggota/rekapitulasi-ruangfilter', {
                  pageTitle: 'Rekapitulasi',
                  path: '/tahunan',
                  rooms1: hasil[0],
                  rooms2: hasil[1],
                  tahun: tahun,
                });

              }else if(req.session.user.peran === 'Fasilitator'){
                res.render('./fasilitator/rekapitulasi-ruangfilter', {
                  pageTitle: 'Rekapitulasi',
                  path: '/tahunan',
                  rooms1: hasil[0],
                  rooms2: hasil[1],
                  tahun: tahun,
                });

              }
          })
          .catch(err => {
              console.log('**********ERROR RESULT****************');
              console.log(err);
          });

};

// MEJS

exports.getDataRekapitulasiMeja = (req,res) => {

  var tanggal = moment();
  const tanggal2 = moment(tanggal, "DD-MM-YYYY");
  var monday = tanggal2.clone().weekday(1).format("YYYY-MM-DD");
  var friday = tanggal2.clone().weekday(5).format("YYYY-MM-DD");

  if(req.session.user.peran === 'Anggota') {
    res.render('./anggota/rekapitulasi-meja', {
      pageTitle: 'Rekapitulasi',
      monday: monday,
      friday: friday,
      path: '/'
    });

  }else if(req.session.user.peran === 'Fasilitator'){
    res.render('./fasilitator/rekapitulasi-meja', {
      pageTitle: 'Rekapitulasi',
      monday: monday,
      friday: friday,
      path: '/'
    });
  }
};


exports.getDataRekapitulasiMejaFilterBulanan = (req,res) => {

  const bulanTahun = req.body.tanggal;
  const tahun = moment(bulanTahun, "MMM-YYYY").format('YYYY');
  const bulan = moment(bulanTahun,  "MMM-YYYY").format('MM');

  const meja1 = Penilaian_meja.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
            {persetujuan_fasil:2}]
          },
          include : {
            model: Pengguna,
            as: 'nik_pic_piket',
            where: {level: 1}
          }
        },
        {
          model: Meja,
          include : {
            model: Pengguna
          }
        }
      ],
      attributes: {
        include: [
          [sequelize.literal('SUM(bobotmeja) / COUNT(bobotmeja)'), 'bobotmeja']
        ]},
      group : ['penggunaNik'],
      order: [
          ['bobotmeja', 'DESC']
      ],
    }
  );

  const meja2 = Penilaian_meja.findAll(
    {
      include:[
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
            {persetujuan_fasil:2}]
          },
          include : {
            model: Pengguna,
            as: 'nik_pic_piket',
            where: {level: 2}
          }
        },
        {
          model: Meja,
          include : {
            model: Pengguna
          }
        }
      ],
      attributes: {
        include: [
          [sequelize.literal('SUM(bobotmeja) / COUNT(bobotmeja)'), 'bobotmeja']
        ]},
      group : ['penggunaNik'],
      order: [
          ['bobotmeja', 'DESC']
      ],
    }
  );

  const mejaTerbaik = Penilaian_meja.findAll(
    {
        include: [
        {
          model: Meja,
          include: [{
            model: Pengguna
          }],
        },
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan)},
            {persetujuan_fasil:2}]

          }
        }
      ],
      attributes: {
        include: [
          [sequelize.literal('SUM(bobotmeja) / COUNT(bobotmeja)'), 'bobotmeja']

        ]},
      group : ['penggunaNik'],
      order: [
          [[sequelize.literal('bobotmeja'), 'DESC']]
      ],
    }
  );

      Promise
          .all([meja1, meja2, mejaTerbaik])
          .then(hasil => {
              console.log('**********COMPLETE RESULTS****************');

              if (hasil[0] > 0){
                hasil[2][0].bobotmeja = parseFloat(hasil[2][0].bobotmeja).toFixed(2);
              }

              res.locals.mejaTerbaik = hasil[2][0];


            if(req.session.user.peran === 'Anggota') {
              res.render('./anggota/rekapitulasi-mejafilter', {
                pageTitle: 'Rekapitulasi',
                path: '/bulanan',
                rooms1: hasil[0],
                rooms2: hasil[1],
                bulan: bulanTahun,
                mejaTerbaik : hasil[2][0]
              });

            }else if(req.session.user.peran === 'Fasilitator'){
              res.render('./fasilitator/rekapitulasi-mejafilter', {
                pageTitle: 'Rekapitulasi',
                path: '/bulanan',
                rooms1: hasil[0],
                rooms2: hasil[1],
                bulan: bulanTahun,
                mejaTerbaik : hasil[2][0]
                
              });
            }
          })
          .catch(err => {
            console.log('**********ERROR RESULT****************');
              console.log(err);
          });

};
