const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');
const moment = require('moment');
const Meja = require('../models/meja');
const Penilaian_meja = require('../models/penilaian_meja');
const Penilaian_ruang = require('../models/penilaian_ruang');

const Ruang = require('../models/ruang');
const sequelize = require('../util/database');
const { Op } = require("sequelize");

exports.getAdminDashboard = (req,res) => {
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }
  const nowTanggal = moment().format('YYYY-MM-DD');
  const nowTanggal2 = moment().locale('id').format("dddd, MMMM Do YYYY, h:mm:ss a");
  var monthMinusOneName =  moment().locale('id').subtract(1, "month").startOf("month").format('MMMM');
  var prevMonth = moment(nowTanggal).subtract(1, 'months').endOf('month').format('MM');
  const tahun = moment(nowTanggal).format('YYYY');



  const piket =   JadwalPiket.findAll({
      where: {tanggal: nowTanggal},
      include: [{
        model: Pengguna,
        as: 'nik_pic_piket'
      },
      {
        model: Pengguna,
        as: 'nik_pic_fasil'
      }
    ]
  });

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
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), prevMonth)},
            {persetujuan_fasil:1}]

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

  const lantaiSatuTerbaik = Penilaian_ruang.findAll(
    {
        include: [
        {
          model: Ruang
        },
        {
          model: JadwalPiket,
          where: {
            [Op.and]:
            [{tanggal:sequelize.where(sequelize.fn('year', sequelize.col('tanggal')), tahun)},
            {tanggal:sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), prevMonth)},
            {persetujuan_fasil:1}]
          },
          include: [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: {level: 1}
          },
          {
            model: Pengguna,
            as: 'nik_pic_fasil'
          }
        ]
        }
      ],
      attributes: {
        include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
        ]},
      group : ['jadwalPiketId'],
      order: [
            [[sequelize.literal('bobotruang'), 'DESC']]
      ],
    }
  );

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
            {persetujuan_fasil:1}]
          },
          include: [{
            model: Pengguna,
            as: 'nik_pic_piket',
            where: {level: 2}
          },
          {
            model: Pengguna,
            as: 'nik_pic_fasil'

          }
        ]
        }
      ],
      attributes: {
      include: [
          [sequelize.literal('SUM(bobotruang * ruang.poin_ruang)'), 'bobotruang']
        ]},
      group : ['jadwalPiketId'],
      order: [
            [[sequelize.literal('bobotruang'), 'DESC']]
      ],
  }
);

  Promise
      .all([mejaTerbaik,lantaiSatuTerbaik, lantaiDuaTerbaik,piket])
      .then(count => {
          console.log('**********COMPLETE RESULTS****************');

          if (count[0].length > 0){
            count[0][0].bobotmeja = parseFloat(count[0][0].bobotmeja).toFixed(2);
          }

          let lantaiSatu = 0;
          let lantaiDua = 0;


          if (count[1].length){
            for(i = 0; i < count[1].length; i++){
              lantaiSatu = parseFloat(lantaiSatu) + parseFloat(count[1][i].bobotruang);
            }
            lantaiSatu = parseFloat(lantaiSatu) / parseFloat(count[1].length);

          }

          if (count[2].length){
            for(i = 0; i < count[2].length; i++){
              lantaiDua = parseFloat(lantaiDua) + parseFloat(count[2][i].bobotruang);
            }
            lantaiDua = parseFloat(lantaiDua) / parseFloat(count[2].length);
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
          res.locals.mejaTerbaik = count[0][0];
          res.locals.lantaiTerbaik = lantaiTerbaik;

          var URL = require('url').URL;
          const myURL = new URL('http://example.org:8888');
          console.log(myURL.port);
          myURL.port ='443';
          console.log(myURL.port);
          console.log(myURL.href);
          myURL.port = '567abcd';
          console.log(myURL.port);
          myURL.port = 1234.5678;
          console.log(myURL.port);



          res.render('./admin/admin', {
            pageTitle: 'Dashboard',
            path: '/',
            schedules: count[3],
            tanggal : nowTanggal2,
            mejaTerbaik : count[0][0],
            lantaiTerbaik: lantaiTerbaik,
            monthMinusOneName:monthMinusOneName
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });

};
