const Ruang = require('../models/ruang');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_ruang = require('../models/penilaian_ruang');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const sequelize = require('../util/database');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

exports.getDataRuangAdmin= (req,res, next) => {
  const pengguna = Pengguna.findAll();
  const ruang = Ruang.findAll( {include: Pengguna});
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
  Promise
      .all([pengguna, ruang])
      .then(hasil => {
          res.render('./admin/checklistruang', {
            rooms: hasil[1],
            users: hasil[0],
            pageTitle: 'Checklist Ruang',
            path: '/checklistruang'
          });
      })
      .catch(err => {
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
  }).then( result =>{
    req.flash('success_messages', 'Ruang sudah ditambah');
    res.redirect('/admin/checklistruang');
    }
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
      req.flash('success_messages', 'Ruang sudah diupdate');
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
      req.flash('success_messages', 'Ruang sudah dihapus');
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
        });
      }
      Penilaian_ruang
      .findAll({
        where: {jadwalPiketId: result[0].dataValues.id},
          include: [
            {
            model: JadwalPiket
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
      });
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
        as: 'nik_pic_piket'
      },
      {
        model: Pengguna,
        as: 'nik_pic_fasil'
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
    const users = Pengguna.findAll({
      where: {
                peran: {
                [Op.not]: 'Admin'
              }
            }
    });

    Promise
        .all([buktiTemuan,users])
        .then(bukti => {
            res.render('./anggota/checklistRuangdetail', {
              room: room,
              pageTitle: 'Checklist Ruang',
              path: '/checklistruangada',
              buktiTemuan: bukti[0],
              users:bukti[1]
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

  Penilaian_ruang
  .findByPk(id)
  .then(penilaian => {
    penilaian.bobotruang = nilai;
    return penilaian.save();
  })
  .then(result => {
    res.redirect('/anggota/checklistruang/detail/'+id);
  })
  .catch(err => console.log(err));
};

exports.postBuktiTemuan = (req,res, next) => {
  const id = req.body.ruangId;
  const tanggal = req.body.tanggal;
  const deskripsi = req.body.deskripsi;
  const tindaklanjut = req.body.tindaklanjut;
  const image = req.files.image;

  if (image !== undefined ){
    const imgUrl = image[0].path;
    Bukti_temuan.create(
      { fotosebelum:imgUrl,
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianRuangId: id,
        penggunaNik: tindaklanjut
      }
    )
    .then(result => {
        res.redirect('/anggota/checklistruang/detail/'+id);
      })
    .catch(err => console.log(err));

  }else {

    Bukti_temuan.create(
      {
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianRuangId: id,
        penggunaNik: tindaklanjut
      }
    )
    .then(result => {
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
