const Ruang = require('../models/ruang');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_ruang = require('../models/penilaian_ruang');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const { Op } = require("sequelize");


// Admin
// exports.getDataRuangAdmin= (req,res, next) => {
//     Pengguna.findAll()
//     .then(pengguna => {
//       Ruang.findAll( {include: Pengguna, as: 'PemilikMeja'} )
//       .then( ruang => {
//         res.render('./admin/checklistruang', {
//           rooms: ruang,
//           users: pengguna,
//           pageTitle: 'Checklist Ruang',
//           path: '/checklistruang'
//         });
//       })
//     })
//     .catch(err => console.log(err));
// };

exports.getDataRuangAdmin= (req,res, next) => {

  const pengguna = Pengguna.findAll();
  const ruang = Ruang.findAll( {include: Pengguna});

  Promise
      .all([pengguna, ruang])
      .then(hasil => {
          console.log('**********COMPLETE RESULTS****************');
          console.log(hasil[0]);
          res.render('./admin/checklistruang', {
            rooms: hasil[1],
            users: hasil[0],
            pageTitle: 'Checklist Ruang',
            path: '/checklistruang'
          });

      })
      .catch(err => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
      });

};

exports.postAddDataRuang = (req,res,next) => {
  const nama_ruang = req.body.nama_ruang;
  const standar = req.body.standar;
  const poin_ruang = req.body.poin_ruang;
  const pic_ruang = req.body.pic_ruang;

  Ruang.create({
    nama_ruang: nama_ruang,
    standar:standar,
    poin_ruang: poin_ruang,
    penggunaNik: pic_ruang
  }).then(
    res.redirect('/admin/checklistruang')
  ).catch(err => console.log(err));
};

exports.postEditRuang = ( req,res, next) => {
  const id = req.body.id;
  const nama_ruang = req.body.nama_ruang_edit;
  const standar = req.body.standar_edit;
  const poin_ruang = req.body.poin_ruang_edit;
  const pic_ruang = req.body.pic_ruang_edit;

  Ruang.findByPk(id)
    .then(ruang => {
      ruang.nama_ruang = nama_ruang;
      ruang.standar = standar;
      ruang.poin_ruang = poin_ruang;
      ruang.penggunaNik = pic_ruang;
      return ruang.save();
    })
    .then(result => {
      console.log('UPDATED RUANG!');
      res.redirect('/admin/checklistruang');
    })
    .catch(err => console.log(err));
};


exports.postDeleteRuang = ( req,res, next) => {
  const id = req.body.ruangId;

  Ruang.findByPk(id)
    .then(ruang => {
      return ruang.destroy();
    })
    .then(result => {
      console.log('DESTROYED RUANG');
      res.redirect('/admin/checklistruang');
    })
    .catch(err => console.log(err));

};

// ANGOTA
exports.getDataRuangAnggota = (req,res, next) => {
  const nowTanggal = moment().format('YYYY-MM-DD');
  console.log(nowTanggal);

  req.user
  .getPemilikJadwal({
    where: {tanggal: nowTanggal}
  })
  .then( result => {
    if (result.length === 0){
        return res.render('./anggota/checklistruang', {
          pageTitle: 'Checklist Ruang',
          path: '/checklistruang'
        })
      }
      Penilaian_ruang
      .findAll({
        where: {jadwalPiketId: result[0].dataValues.id},
          include: [
            {
            model: JadwalPiket,
          },
          {
            model: Ruang,
            include : {
              model: Pengguna,
              where: {level: req.session.level }
            }
          }
        ]
      })
      .then( ruang => {
        console.log(ruang);
        res.render('./anggota/checklistRuang', {
          rooms: ruang,
          pageTitle: 'Checklist Ruang',
          path: '/checklistruangada'
        });
      })

  })
    .catch(err => console.log(err));
};

exports.getDataRuangDetail = (req,res, next) => {
const id = req.params.ruangId;
  Penilaian_ruang.findByPk(id, {
    include: [
      {
      model: JadwalPiket,
      include : [{
        model: Pengguna,
        as: 'nik_pic_piket',
      },
      {
        model: Pengguna,
        as: 'nik_pic_fasil',
      }
    ]},
    {
      model: Ruang,
      include : {
        model: Pengguna
      }
    }
  ]
  })
  .then( room => {
    const buktiTemuan = Bukti_temuan.findAll({
      where: {penilaianRuangId: id}
    });

    Promise
        .all([buktiTemuan])
        .then(bukti => {
            console.log('**********COMPLETE RESULTS****************');
            console.log(bukti);

            res.render('./anggota/checklistruangdetail', {
              room: room,
              pageTitle: 'Checklist Ruang',
              path: '/checklistruangada',
              buktiTemuan: bukti[0]
            });

        })
        .catch(err => {
            console.log('**********ERROR RESULT****************');
            console.log(err);
        });


  })
  .catch(err => console.log(err));

};

exports.postNilaiRuang = (req,res, next) => {
  const id = req.body.ruangId;
  const nilai = req.body.nilai;

  console.log("ini nilai");
  console.log(nilai);
  console.log("ini ruang");
  console.log(id);

  Penilaian_ruang
  .findByPk(id)
  .then(penilaian => {
    penilaian.bobotruang = nilai;
    return penilaian.save();
  })
  .then(result => {
    console.log('UPDATED NILAI!');
    res.redirect('/anggota/checklistruang/detail/'+id);
  })
  .catch(err => console.log(err));


};

exports.postBuktiTemuan = (req,res, next) => {
  const id = req.body.ruangId;
  const tanggal = req.body.tanggal;
  const deskripsi = req.body.deskripsi;
  const image = req.files.image;

  if (image != null ){
    const imgUrl = image[0].path;

    console.log(imgUrl);
    console.log("tanggal " + tanggal);
    console.log("deskripsi " +deskripsi);
    console.log("id " + id);

    Bukti_temuan.create(
      { fotosebelum:imgUrl,
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianRuangId: id
      }
    )
    .then(result => {
        console.log('UPDATED BUKTI!');
        res.redirect('/anggota/checklistruang/detail/'+id);
      })
    .catch(err => console.log(err));

  }else {

    Bukti_temuan.create(
      {
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianRuangId: id
      }
    )
    .then(result => {
        console.log('UPDATED BUKTI!');
        res.redirect('/anggota/checklistruang/detail/'+id);
      })
    .catch(err => console.log(err));

  }

};

exports.postCheckPic = (req,res, next) => {
  const id = req.body.check;
  Penilaian_ruang
  .findByPk(id)
  .then( penilaian => {
    penilaian.persetujuanpicpiket = 1;
    return penilaian.save();
  })
  .then(result => {
    console.log('UPDATED NILAI!');
    res.redirect('/anggota/checklistruang/detail/'+id);
  })
  .catch(err => console.log(err));


};

exports.getDataRuang = (req,res, next) => {
  const id = req.params.ruangId;

      Penilaian_ruang
      .findAll({
        where: {jadwalPiketId: id},
          include: [
            {
            model: JadwalPiket,
          },
          {
            model: Ruang,
            include : {
              model: Pengguna
            }
          }
        ]
      })
      .then( ruang => {
        res.render('./anggota/checklistRuang', {
          rooms: ruang,
          pageTitle: 'Checklist Ruang',
          path: '/checklistruangada',
          piketId: id
        });

  })
    .catch(err => console.log(err));

};
