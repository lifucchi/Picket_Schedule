const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_meja = require('../models/penilaian_meja');
const JadwalPiket = require('../models/jadwal_piket');
const Bukti_temuan = require('../models/bukti_temuan');
const { Op } = require("sequelize");

// ADMIN

exports.getDataMejaAdmin = (req,res, next) => {
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
    })
  })
  .catch(err => console.log(err));
};

exports.postAddDataMeja = (req,res,next) => {
  const pemilik_meja = req.body.pemilik_meja;
  const standar = req.body.standar;

  Meja.create({
    penggunaNik: pemilik_meja,
    standar:standar,

  }).then(
    res.redirect('/admin/checklistmeja')
  ).catch(err => console.log(err));
};

exports.postAddDataAllMeja = (req,res,next) => {
  const standar = req.body.standar;


  Pengguna
  .findAll({ where: {peran: { [Op.not] : 'Admin'}}})
  .then( pemilik => {

    var pemilikmeja = [];
    for (var i = 0; i < pemilik.length; i++){
      var penObj = {
        penggunaNik: pemilik[i].dataValues.nik,
        standar:standar
      };
      pemilikmeja.push(penObj);
    }
    Meja
    .bulkCreate(pemilikmeja)
    .then( res.redirect('/admin/checklistmeja') );
  })
  .catch(err => console.log(err));


};


exports.postEditMeja = ( req,res, next) => {
  const id = req.body.id;
  const pemilik = req.body.pemilik_meja_edit;
  const standar = req.body.standar_edit;
  // console.log(pemilik);
  Meja.findByPk(id)
    .then(meja => {
      meja.penggunaNik = pemilik;
      meja.standar = standar;

      return meja.save();
    })
    .then(result => {
      console.log('UPDATED MEJA!');
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
      console.log('DESTROYED Meja');
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
  })
  .then( result => {
    console.log("ini getpemilikjadwal");
    console.log(result);

    if (result.length === 0){
        return res.render('./anggota/checklistmeja', {
          pageTitle: 'Checklist Meja',
          path: '/checklistmeja'
        })
      }

    Penilaian_meja
    .findAll({
      where: {jadwalPiketId: result[0].dataValues.id},
        include: [
          {
          model: JadwalPiket,
        },
        {
          model: Meja,
          include : {
            model: Pengguna
          }
        }
      ]
    })
    .then( penilaianmeja => {
      console.log("penilaian meja");
      console.log(penilaianmeja);
      return res.render('./anggota/checklistmeja', {
        tables: penilaianmeja,
        pageTitle: 'Checklist Meja',
        path: '/checklistmejaada'
      });
    })
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
        as: 'nik_pic_piket',
      },
      {
        model: Pengguna,
        as: 'nik_pic_fasil',
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
    res.render('./anggota/checklistmejadetail', {
      tables: table,
      pageTitle: 'Checklist Meja',
      path: '/checklistmejaada'
    });
  })
  .catch(err => console.log(err));

};

exports.postNilaiMeja = (req,res, next) => {
  const id = req.body.mejaId;
  const nilai = req.body.nilai;

  console.log("ini nilai");
  console.log(nilai);
  console.log("ini meja");
  console.log(id);

  Penilaian_meja
  .findByPk(id)
  .then(penilaian => {
    penilaian.bobotmeja = nilai;
    return penilaian.save();
  })
  .then(result => {
    console.log('UPDATED NILAI!');
    res.redirect('/anggota/checklistmeja/detail/'+id);
  })
  .catch(err => console.log(err));


};

exports.postBuktiTemuan = (req,res, next) => {
  const id = req.body.mejaId;
  const tanggal = req.body.tanggal;
  const deskripsi = req.body.deskripsi;
  const image = req.file;

  if (image != null ){
    const imgUrl = image.path;
    Bukti_temuan.create(
      { fotosebelum:imgUrl,
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianMejaId: id
      }
    )
    .then(result => {
          console.log('UPDATED BUKTI!');
          res.redirect('/anggota/checklistmeja/detail/'+id);
        })
      .catch(err => console.log(err));
  }else{
    Bukti_temuan.create(
      {
        deskripsi_sebelum:deskripsi,
        deadline:tanggal,
        penilaianMejaId: id
    }
  )
  .then(result => {
        console.log('UPDATED BUKTI!');
        res.redirect('/anggota/checklistmeja/detail/'+id);
      })
    .catch(err => console.log(err));
}

  // console.log(imgUrl);
  // console.log("tanggal " + tanggal);
  // console.log("deskripsi " +deskripsi);
  // console.log("id " + id);




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
    console.log('UPDATED!');
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
          model: JadwalPiket,
        },
        {
          model: Meja,
          include : {
            model: Pengguna
          }
        }
      ]
    })
    .then( penilaianmeja => {
      console.log("penilaian meja");
      console.log(penilaianmeja);
      return res.render('./anggota/checklistmeja', {
        tables: penilaianmeja,
        pageTitle: 'Checklist Meja',
        path: '/checklistmejaada',
        piketId: id,
      });
    })
    .catch(err => console.log(err));

};
