const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_meja = require('../models/penilaian_meja');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const { Op } = require("sequelize");

// ADMIN
exports.getDataMejaAdmin = (req,res, next) => {
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
  Pengguna.findAll()
  .then(pengguna => {
    Meja.findAll( {include: Pengguna} )
    .then( table => {
      res.render('./admin/checklistmeja', {
        tables: table,
        users: pengguna,
        pageTitle: 'Checklist Meja',
        path: '/checklistmeja'
      });
    });
  })
  .catch(err => console.log(err));
};

exports.postAddDataMeja = (req,res,next) => {
  const pemilik_meja = req.body.pemilik_meja;
  const standar = req.body.standar;

  Meja.findAll(
        {where: {penggunaNik: pemilik_meja}},
  )
  .then( hasil => {
    if (hasil.length > 0){
      req.flash('error_messages', 'Meja sudah ada');
      res.redirect('/admin/checklistmeja');
    }else{
      Meja.create({
        penggunaNik: pemilik_meja,
        standar:standar
      })
      .then(result => {
        req.flash('success_messages', 'Meja sudah ditambah');
        res.redirect('/admin/checklistmeja');
      }
      ).catch(err => console.log(err));
    }
  })
.catch(err => console.log(err));

};

exports.postAddDataAllMeja = (req,res,next) => {
  const standar = req.body.standar;

  Pengguna
  .findAll({ where: {peran: { [Op.not] : 'Admin'}}})
  .then( pemilik => {
    var pemilikmeja = [];
    var penObj = {};
    for (var i = 0; i < pemilik.length; i++){
      penObj = {
        penggunaNik: pemilik[i].dataValues.nik,
        standar:standar
      };
      pemilikmeja.push(penObj);
    }
    Meja
    .bulkCreate(pemilikmeja)
    .then(result => {
      req.flash('success_messages', 'Meja sudah ditambah');
      res.redirect('/admin/checklistmeja');
    })
  })
  .catch(err => console.log(err));
};


exports.postEditMeja = ( req,res, next) => {
  const id = req.body.id;
  const pemilik = req.body.pemilik_meja_edit;
  const standar = req.body.standar_edit;

  Meja.findByPk(id)
    .then(meja => {
      meja.penggunaNik = pemilik;
      meja.standar = standar;
      return meja.save();
    })
    .then(result => {
      req.flash('success_messages', 'Meja sudah diupdate');
      res.redirect('/admin/checklistmeja');
    })
    .catch(err => console.log(err));
};


exports.postDeleteMeja = ( req,res, next) => {
  const id = req.body.mejaId;
  Meja.findByPk(id)
    .then(meja => {
      return meja.destroy();
    })
    .then(result => {
      req.flash('success_messages', 'Meja sudah dihapus');

      res.redirect('/admin/checklistmeja');
    })
    .catch(err => console.log(err));
};


// ANGGOTA
exports.getDataMejaAnggota = (req,res, next) => {
  const nowTanggal = moment().format('YYYY-MM-DD');
  console.log(nowTanggal);

  req.user
  .getPemilikJadwal({
    where: {tanggal: nowTanggal},
    order: [
        ['persetujuanpicpiket', 'ASC'],
    ]
  })
  .then( result => {
    if (result.length === 0){
         res.render('./anggota/checklistmeja', {
          pageTitle: 'Checklist Meja',
          path: '/checklistmeja'
        });
      }
    Penilaian_meja
    .findAll({
      where: {jadwalPiketId: result[0].dataValues.id},
        include: [
          {
          model: JadwalPiket
        },
        {
          model: Meja,
          include : {
            model: Pengguna
          }
        }
      ],
      order: [
          ['bobotmeja', 'ASC']
      ],
    })
    .then( penilaianmeja => {
       res.render('./anggota/checklistmeja', {
        tables: penilaianmeja,
        pageTitle: 'Checklist Meja',
        path: '/checklistmejaada'
      });
    });
  })
    .catch(err => console.log(err));

};

exports.getDataMejaDetail = (req,res, next) => {
const id = req.params.mejaId;
  Penilaian_meja.findByPk(id, {
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
    ]
    },
    {
      model: Meja,
      include : {
        model: Pengguna
      }
    }
  ]
  })
  .then( table => {

    const buktiTemuan = Bukti_temuan.findAll({
      where: {penilaianMejaId: id}
    });

    const member = Pengguna.findAll();
    Promise
        .all([buktiTemuan,member])
        .then(bukti => {
            console.log('**********COMPLETE RESULTS****************');

            res.render('./anggota/checklistmejadetail', {
              tables: table,
              pageTitle: 'Checklist Meja',
              path: '/checklistmejaada',
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

exports.postNilaiMeja = (req,res, next) => {
  const id = req.body.mejaId;
  const nilai = req.body.nilai;

  Penilaian_meja
  .findByPk(id)
  .then(penilaian => {
    penilaian.bobotmeja = nilai;
    return penilaian.save();
  })
  .then(result => {
    res.redirect('/anggota/checklistmeja/detail/'+id);
  })
  .catch(err => console.log(err));
};

exports.postBuktiTemuan = (req,res, next) => {
  const id = req.body.mejaId;
  const tanggal = req.body.tanggal;
  const deskripsi = req.body.deskripsi;
  const tindaklanjut = req.body.tindaklanjut;

  const image = req.files.image;
  console.log(image);

  if (image !== undefined  ){
    const imgUrl = image[0].path;
    Bukti_temuan.create(
      { fotosebelum:imgUrl,
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianMejaId: id,
        penggunaNik: tindaklanjut
      }
    )
    .then(result => {
          res.redirect('/anggota/checklistmeja/detail/'+id);
        })
      .catch(err => console.log(err));
  }else{
    Bukti_temuan.create(
      {
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianMejaId: id,
        penggunaNik: tindaklanjut

    }
  )
  .then(result => {
        res.redirect('/anggota/checklistmeja/detail/'+id);
      })
    .catch(err => console.log(err));
}


};

exports.postCheckPic = (req,res, next) => {
  const id = req.body.check;
  Penilaian_meja
  .findByPk(id)
  .then( penilaian => {
    penilaian.persetujuanpicpiket = 1;
    return penilaian.save();
  })
  .then(result => {
    res.redirect('/anggota/checklistmeja/detail/'+id);
  })
  .catch(err => console.log(err));
};

exports.getDataMeja = (req,res, next) => {
  const id = req.params.mejaId;
    Penilaian_meja
    .findAll({
      where: {jadwalPiketId: id},
        include: [
          {
          model: JadwalPiket
        },
        {
          model: Meja,
          include : {
            model: Pengguna
          }
        }
      ],
      order: [
          ['persetujuanpicpiket', 'DESC']
      ]
    })
    .then( penilaianmeja => {
      res.render('./anggota/checklistmeja', {
        tables: penilaianmeja,
        pageTitle: 'Checklist Meja',
        path: '/checklistmejaada',
        piketId: id
      });
    })
    .catch(err => console.log(err));
};
